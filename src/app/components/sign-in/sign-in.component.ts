import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SharedServiceService } from 'src/app/services/shared-service.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent {
  userCreditials: any = {
    email: '',
    password: ''
  }

  constructor(private snackbar: MatSnackBar, private router: Router, private sharedService: SharedServiceService) { }

  submit() {
    // Fetch all users/doctors
    let users: any = this.sharedService.fetch('patients', 'local');

    if (users.length > 0) {
      const isFound = users.find((user: any) => user.email === this.userCreditials.email);
      if (isFound) {
        // If user exist
        if (this.userCreditials.password === isFound.password) {
          this.snackbar.open('Logged in successfully', 'Ok', { duration: 3000 });
          // Store logged in user in session storage
          this.sharedService.store('user', 'session', isFound);
          this.router.navigate(['/home']);
        } else {
          this.snackbar.open('Password does not match', 'Ok', { duration: 3000 });
          return;
        }
      } else {
        if (this.userCreditials.email === 'admin123@gmail.com') {
          let admin: any = localStorage.getItem('admin');
          admin = admin ? JSON.parse(admin) : [];
          // If admin exist
          if (admin.length > 0) {
            if (this.userCreditials.password === admin[0].password) {
              this.snackbar.open('Admin logged in successfully', 'Ok', { duration: 3000 });
              // Store admin in session storage
              this.sharedService.store('admin', 'session', admin);
              this.router.navigate(['/landing']);
              // Check if admin
              return;
            } else {
              this.snackbar.open('Admin password does not match', 'Ok', { duration: 3000 });
              return;
            }
          }
        }
        // If user doesn't exist
        const allDoctors = this.sharedService.fetch('doctors', 'local');
        const isFound = allDoctors.find((doctor: any) => doctor.email === this.userCreditials.email);
        if (isFound) {
          this.snackbar.open(`Doctor account is up to date`, 'Ok', { duration: 3000 });
          return;
        } else {
          this.snackbar.open('Account does not exist', 'Ok', { duration: 3000 });
          // Send the user to the register page
          this.router.navigate(['/sign-up']);
        }
      }
    } else {
      if (this.userCreditials.email === 'admin123@gmail.com') {
        let administator: any = localStorage.getItem('admin');
        administator = administator ? JSON.parse(administator) : [];
        // If administator exist
        if (administator.length > 0) {
          if (this.userCreditials.password === administator[0].password) {
            this.snackbar.open('Admin logged in successfully', 'Ok', { duration: 3000 });
            // Store admin in session storage
            this.sharedService.store('admin', 'session', administator);
            this.router.navigate(['/landing']);
            return;
          } else {
            this.snackbar.open('Admin password does not match', 'Ok', { duration: 3000 });
            return;
          }
        }
      }
      this.snackbar.open('No users exist', 'Ok', { duration: 3000 });
      this.router.navigate(['/sign-up']);
    }

  }

}
