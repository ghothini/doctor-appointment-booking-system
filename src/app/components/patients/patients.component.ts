import { Component } from '@angular/core';
import { SharedServiceService } from 'src/app/services/shared-service.service';

@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.scss']
})
export class PatientsComponent {
  displayedColumns: string[] = ['name', 'surname','idNumber', 'registerDate','email','delete'];
  dataSource!: any;
  allPatients: any;
  allAppointments: any;

  constructor(private sharedService: SharedServiceService) {
    this.allPatients = this.sharedService.fetch('patients','local');
    this.dataSource = this.allPatients;
    this.allAppointments = this.sharedService.fetch('appointments','local');
  }

  deletePatient(patientID: number): void {
    this.allPatients = this.allPatients.filter((patient: any) => patient.id != patientID);
    console.log(this.allAppointments)
    this.allAppointments = this.allAppointments.filter((appointment: any) => appointment.patientID != patientID)
    console.log(this.allAppointments);
    this.dataSource = this.allPatients
    this.sharedService.store('patients','local',this.allPatients);
    this.sharedService.store('appointments','local',this.allAppointments);
  }
}
