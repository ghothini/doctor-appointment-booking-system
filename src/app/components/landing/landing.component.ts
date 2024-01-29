import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent {
  linkIcon: string = '../../../assets/icons/patient_list_FILL0_wght400_GRAD0_opsz24.svg';
  navItems: any = [{
    label: 'Appointments',
    route: '/landing/appointments',
    linkIcon: '../../../assets/icons/pending_actions_FILL0_wght400_GRAD0_opsz24.svg'
  }, {
    label: 'Doctors',
    route: '/landing/doctors',
    linkIcon: '../../../assets/icons/stethoscope_FILL0_wght400_GRAD0_opsz24.svg'
  }, {
    label: 'Patients',
    route: '/landing/patients',
    linkIcon: '../../../assets/icons/patient_list_FILL0_wght400_GRAD0_opsz24.svg'
  }];
  selected: number = 0;
  adding: string = '';
  // Get admin tab
  constructor(private router: Router) {
    const tab = sessionStorage.getItem('tab');
    this.selected = tab ? JSON.parse(tab) : 0;
    this.router.navigate(['/landing/appointments']);
    this.selected = 0;
  }

  selectedNav(indx: number) {
    console.log(indx)
    this.selected = indx;
    sessionStorage.setItem('tab', JSON.stringify(this.selected));
  }

  logOut(): void {
    sessionStorage.removeItem('admin');
    sessionStorage.removeItem('tab');
    this.router.navigate(['/sign-in']);
  }
}
