import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { AssignDoctorComponent } from '../assign-doctor/assign-doctor.component';

@Component({
  selector: 'app-see-appointment',
  templateUrl: './see-appointment.component.html',
  styleUrls: ['./see-appointment.component.scss']
})
export class SeeAppointmentComponent {
  appointmentStatuses: string[] = ['accepted', 'canceled'];
  appointmentToSee: any;
  appointmentToSeeObj: any;
  appointmentToAssign: any = {};
  status: string = 'pending';
  constructor(private sharedService: SharedServiceService, private snackbar: MatSnackBar,
    private dialogRef: MatDialogRef<SeeAppointmentComponent>, private dialog: MatDialog) {
    this.appointmentToSeeObj = this.sharedService.fetch('appointmentToSee', 'local');
    const allAppointments = this.sharedService.fetch('appointments', 'local');
    this.appointmentToSee = allAppointments.find((appointment: any) => appointment.id === this.appointmentToSeeObj.id);
    this.status = this.appointmentToSee.status;
  }

  close() {
    this.dialogRef.close()
  }

  submitStatus(status: string, id: number): void {
    if (status.toLowerCase() === 'canceled') {
      // Update appointments on local storage
      const allAppointments = this.sharedService.fetch('appointments', 'local');
      allAppointments.forEach((appointment: any) => {
        if (appointment.id === this.appointmentToSee.id) {
          appointment.status = status;
          this.sharedService.store('appointments', 'local', allAppointments);
          this.sharedService.updateAppointments(allAppointments)
          return;
        }
      })
      // Update appointment status for patient
      const allUsers = this.sharedService.fetch('patients', 'local');
      allUsers.forEach((patient: any) => {
        if (patient.firstName.toLowerCase() === this.appointmentToSee.patientName.split(' ')[0].toLowerCase() && patient.lastName.toLowerCase() === this.appointmentToSee.patientName.split(' ')[1].toLowerCase()) {
          patient.appointments.forEach((appointment: any) => {
            if (appointment.id === this.appointmentToSee.id) {
              appointment.status = status;
              console.log(patient);
              this.sharedService.store('patients', 'local', allUsers);
              this.appointmentToSeeObj['status'] = status;
              this.sharedService.store('appointmentToSee', 'local', this.appointmentToSeeObj);
              return;
            }
          })
        }
      })
      this.status = status;
      this.snackbar.open('Status changed successfully', 'Ok', { duration: 3000 });
    } else {
      const doctorsFound = this.sharedService.fetch('doctors', 'local');
      if (doctorsFound.length < 1) {
        this.snackbar.open('Register doctors in the system to assign appointments', 'Ok', { duration: 3000 });
        return;
      }
      this.appointmentToAssign['id'] = id;
      this.sharedService.store('appointmentToAssign', 'local', this.appointmentToAssign);
      this.dialogRef.close();
      this.dialog.open(AssignDoctorComponent);
    }

  }
}
