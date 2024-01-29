import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SharedServiceService } from 'src/app/services/shared-service.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent {
  roles: any[] = ['patient', 'doctor'];
  employmentStatuses: any[] = ['employed', 'unemployed'];
  availabilities: string[] = ['available'];
  specializations: string[] = ['heart operator', 'medicine operator', 'health consultor'];
  today = new Date();
  users: any[] = [];
  userCreditials: any = {
    firstName: '',
    lastName: '',
    role: '',
    appointments: [],
    idNumber: null,
    email: '',
    password: '',
    confirmPassword: ''
  }

  constructor(private snackbar: MatSnackBar, private router: Router, private sharedService: SharedServiceService) { }

  submit() {
    console.log(this.userCreditials);
    if (this.userCreditials.password != this.userCreditials.confirmPassword) {
      this.snackbar.open('Passwords do not match', 'Ok', { duration: 3000 });
      return;
    }

    // Fetch all users/doctors
    if (this.userCreditials.role === 'doctor') {
      this.users = this.sharedService.fetch('doctors','local');
    } else {
      this.users = this.sharedService.fetch('patients','local');
    }

    if (this.users.length > 0) {
      let isFound = this.users.find((user: any) => user.email === this.userCreditials.email)
      if (isFound) {
        // If user exists
        this.snackbar.open('Account already exists', 'Ok', { duration: 3000 });
        return;
      } else {
        if (this.userCreditials.email === 'admin123@gmail.com') {
          localStorage.setItem('admin',JSON.stringify(this.userCreditials));
          this.snackbar.open(`Admin profile registered successfully`, 'Ok', { duration: 3000 });
          this.router.navigate(['/sign-in']);
          return;
        }
        // If user doesn't exist
        this.addNewPatient();
      }
    } else {
      if (this.userCreditials.email === 'admin123@gmail.com') {
        const admin = [];
        admin.push(this.userCreditials)
        localStorage.setItem('admin',JSON.stringify(admin));
        this.snackbar.open(`Admin profile registered successfully`, 'Ok', { duration: 3000 });
        this.router.navigate(['/sign-in']);
        return;
      }
      this.addNewPatient();
    }
  }
  addNewPatient(): void {
    delete this.userCreditials.confirmPassword;
    this.userCreditials = {
      ...this.userCreditials,
      date: this.today
    }
    if (this.userCreditials.role === 'doctor') {
      this.userCreditials = {
        ...this.userCreditials,
        id: `doctor-${new Date().getTime()}`
      }
      this.users.push(this.userCreditials);
      this.sharedService.store('doctors', 'local', this.users);
      this.snackbar.open(`Doctor profile registered successfully`, 'Ok', { duration: 3000 });
      this.router.navigate(['/sign-in']);
      return;
    }
    this.userCreditials = {
      ...this.userCreditials,
      id: `patient-${new Date().getTime()}`
    }
    this.users.push(this.userCreditials);
    this.sharedService.store('patients', 'local', this.users);
    this.snackbar.open(`${this.userCreditials.email} was added successfully`, 'Ok', { duration: 3000 });
    this.router.navigate(['/sign-in']);
  }
}
