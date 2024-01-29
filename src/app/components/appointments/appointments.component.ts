import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { AssignDoctorComponent } from 'src/app/popups/assign-doctor/assign-doctor.component';
import { SeeAppointmentComponent } from 'src/app/popups/see-appointment/see-appointment.component';
import { SharedServiceService } from 'src/app/services/shared-service.service';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.scss']
})
export class AppointmentsComponent {
  appointmentStatuses: string[] = ['accepted', 'canceled']
  displayedColumns: string[] = ['appointmentCreateDate', 'patientName', 'appointmentTitle', 'assignedDoctor', 'appointmentDate', 'status', 'delete'];
  dataSource!: any;
  showOption: boolean = false;
  appointmentToSee: any = {};
  appointmentToAssign: any = {};
  editAppointment: any;
  subscription!: Subscription;

  constructor(private sharedService: SharedServiceService, private dialog: MatDialog, private snackbar: MatSnackBar) {
    this.dataSource = this.sharedService.fetch('appointments','local');
    this.subscription = this.sharedService.watchAppointments().subscribe((allAppointments: any) => this.dataSource = allAppointments)
    const toSee = this.sharedService.fetch('appointmentToSee', 'local');
    this.appointmentToSee = toSee.id ? toSee : {};
  }

  showOptions() {
    this.showOption = !this.showOption;
  }

  seeAppointment(appointmentID: number): void {
    this.appointmentToSee['id'] = appointmentID
    console.log(this.appointmentToSee);
    this.sharedService.store('appointmentToSee', 'local', this.appointmentToSee);
    this.dialog.open(SeeAppointmentComponent);
  }

  deleteAppointment(patientName: string, appointmentID: number): void {
    console.log(appointmentID)
    const updatedAppointments = this.dataSource.filter((patient: any) => patient.id != appointmentID);
    this.sharedService.store('appointments', 'local', updatedAppointments);
    this.sharedService.updateAppointments(updatedAppointments);
    const allUsers = this.sharedService.fetch('patients', 'local');
    allUsers.forEach((patient: any) => {
      if (patient.firstName.toLowerCase() === patientName.split(' ')[0].toLowerCase() && patient.lastName.toLowerCase() === patientName.split(' ')[1].toLowerCase()) {
        console.log(patient)
        patient.appointments = patient.appointments.filter((appointment: any) => appointment.id != appointmentID);
      }
    })
    this.sharedService.store('patients', 'local', allUsers);
    this.snackbar.open('Appointment deleted successfully', 'Ok', { duration: 3000 });
  }

  submitStatus(status: string, id: number): void {
    if (status.toLowerCase() === 'canceled') {
      // Update appointments on local storage
      const allAppointments = this.sharedService.fetch('appointments', 'local');
      allAppointments.forEach((appointment: any) => {
        if (appointment.id === id) {
          appointment.status = status;
          this.editAppointment = appointment;
          this.sharedService.store('appointments', 'local', allAppointments);
          this.sharedService.updateAppointments(allAppointments);
          return;
        }
      })
      // Update appointment status for patient
      const allUsers = this.sharedService.fetch('patients', 'local');
      allUsers.forEach((patient: any) => {
        if (patient.firstName.toLowerCase() === this.editAppointment.patientName.split(' ')[0].toLowerCase() && patient.lastName.toLowerCase() === this.editAppointment.patientName.split(' ')[1].toLowerCase()) {
          patient.appointments.forEach((appointment: any) => {
            if (appointment.id === this.editAppointment.id) {
              appointment.status = status;
              console.log(patient);
              this.sharedService.store('patients', 'local', allUsers);
              return;
            }
          })
        }
      })
      this.snackbar.open('Status changed successfully', 'Ok', { duration: 3000 });
    } else {
      const doctorsFound = this.sharedService.fetch('doctors','local');
      if(doctorsFound.length < 1) {
        this.snackbar.open('Register doctors in the system to assign appointments','Ok',{duration: 3000});
        return;
      }
      this.appointmentToAssign['id'] = id;
      this.sharedService.store('appointmentToAssign','local',this.appointmentToAssign);
      this.dialog.open(AssignDoctorComponent);
    }

  }
}
