import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AddAppointmentComponent } from 'src/app/popups/add-appointment/add-appointment.component';
import { SharedServiceService } from 'src/app/services/shared-service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  allAppointments!: any;
  loggedInUser!: any;
  showPopup: boolean = false;
  showPopupDetails: any;
  subscription: Subscription;
  seeTitle: any;
  constructor(private dialog: MatDialog, private sharedService: SharedServiceService, private snackbar: MatSnackBar, private router: Router) {
    this.loggedInUser = this.sharedService.fetch('user', 'session');
    this.allAppointments = this.loggedInUser.appointments;
    this.subscription = this.sharedService.watchPatientAppointment().subscribe((appointment: any) => this.allAppointments = appointment)
  }

  deleteAppointment(appointmentId: number): void {
    this.allAppointments = this.allAppointments.filter((appointment: any) => appointment.id != appointmentId);

    // Update user's appointments
    const allUsers = this.sharedService.fetch('patients', 'local');

    allUsers.forEach((patient: any) => {
      if (patient.email === this.loggedInUser.email) {
        patient.appointments = this.allAppointments;
        // Update storage
        this.sharedService.store('patients', 'local', allUsers);
        this.sharedService.store('user', 'session', patient);
      }
    })
    // Delete appointment
    let temp = this.sharedService.fetch('appointments','local');
    console.log(temp)
    temp = temp.filter((appointment: any) => appointment.id != appointmentId);
    console.log(temp);
    this.sharedService.store('appointments','local',temp);
  }
  addAppointment(): void {
    this.dialog.open(AddAppointmentComponent);
  }

  log(status: string) {
    if (status.toLocaleLowerCase() === 'pending') return;
    this.snackbar.open(`Appointment was ${status.toLowerCase()} by the hospital`, 'Ok', { duration: 3000 })
  }

  showAppointment(id: number, status: string): void {
    if (status === 'canceled' || status === 'pending') return;
    this.showPopup = !this.showPopup;
    this.allAppointments.forEach((appointment: any) => {
      if (appointment.id === id) {
        this.showPopupDetails = appointment;
      }
    })
  }

  logOut(): void {
    sessionStorage.removeItem('user');
    this.router.navigate(['/sign-in']);
  }
}
