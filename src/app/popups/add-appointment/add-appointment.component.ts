import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedServiceService } from 'src/app/services/shared-service.service';

@Component({
  selector: 'app-add-appointment',
  templateUrl: './add-appointment.component.html',
  styleUrls: ['./add-appointment.component.scss']
})
export class AddAppointmentComponent {
  loggedInUser: any;
  appointment: any = {
    title: '',
    description: '',
    patientName: '',
    appointmentDate: null,
    status: 'pending'
  }
  constructor(private dialogReg: MatDialogRef<AddAppointmentComponent>,
    private sharedService: SharedServiceService, private snackbar: MatSnackBar) {
    this.loggedInUser = this.sharedService.fetch('user', 'session');
    this.appointment.patientName = this.loggedInUser.firstName + ' ' + this.loggedInUser.lastName;
  }
  close(): void {
    this.dialogReg.close();
  }

  submit() {
    this.appointment = {
      ...this.appointment,
      appointmentCreateDate: new Date(),
      id: `appointment-${new Date().getTime()}`
    }
    const allAppointments = this.sharedService.fetch('appointments', 'local');
    const allUsers = this.sharedService.fetch('patients', 'local');
    allUsers.forEach((patient: any) => {
      if (patient.email === this.loggedInUser.email) {
        patient.appointments.push(this.appointment);
        this.sharedService.updatePatientAppointment(patient.appointments);
        this.appointment = {
          ...this.appointment,
          patientID: patient.id
        }
        this.sharedService.store('user', 'session', patient);
      }
    })
    allAppointments.push(this.appointment);
    this.sharedService.store('appointments', 'local', allAppointments);
    this.sharedService.store('patients', 'local', allUsers);
    this.snackbar.open('Appointment was added successfully', 'Ok', { duration: 3000 });
    this.dialogReg.close();
  }
}
