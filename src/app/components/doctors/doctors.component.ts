import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedServiceService } from 'src/app/services/shared-service.service';

@Component({
  selector: 'app-doctors',
  templateUrl: './doctors.component.html',
  styleUrls: ['./doctors.component.scss']
})
export class DoctorsComponent {
  displayedColumns: string[] = ['name', 'surname', 'specialization', 'medicalRoom', 'availability','delete'];
  dataSource!: any;
  allDoctors: any;
  constructor(private sharedService: SharedServiceService, private snackbar: MatSnackBar){
    this.allDoctors = this.sharedService.fetch('doctors','local');
    this.dataSource = this.allDoctors;
  }

  deleteDoctor(doctorID: number): void {
    console.log(doctorID)
    this.allDoctors = this.allDoctors.filter((doctor: any) => doctor.id != doctorID);
    this.dataSource = this.allDoctors
    this.sharedService.store('doctors','local',this.allDoctors);
    this.snackbar.open('Doctor deleted successfully','Ok',{duration: 3000});
  }
}
