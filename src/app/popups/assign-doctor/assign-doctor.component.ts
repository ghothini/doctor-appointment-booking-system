import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedServiceService } from 'src/app/services/shared-service.service';

@Component({
  selector: 'app-assign-doctor',
  templateUrl: './assign-doctor.component.html',
  styleUrls: ['./assign-doctor.component.scss']
})
export class AssignDoctorComponent {
  allDoctors: any;
  allAppointments: any;
  allPatients: any;
  appointmentToAssign: any;
  appointmentAssignFormData: any = {
    doctor: null,
    date: ''
  }

  constructor(private sharedService: SharedServiceService, private snackbar: MatSnackBar, private dialogRef: MatDialogRef<AssignDoctorComponent>){
    this.allDoctors = this.sharedService.fetch('doctors','local');
    this.allAppointments = this.sharedService.fetch('appointments','local');
    this.allPatients = this.sharedService.fetch('patients','local');
    const appointmentToAssign = this.sharedService.fetch('appointmentToAssign','local');
    this.appointmentToAssign = appointmentToAssign.id ? appointmentToAssign : {}; 
    console.log(this.appointmentToAssign)

    // Show appointment date
    this.allPatients.forEach((patient:any) => {
      patient.appointments.forEach((appointment: any) => {
        if(appointment.id === this.appointmentToAssign.id) {
          this.appointmentAssignFormData.date = appointment.appointmentDate
          console.log(this.appointmentAssignFormData.date)
        }
      } )
    })
  }

  submit(): void {
    console.log(this.appointmentAssignFormData);

    // Update patient appointment with assigned doctor
    this.allPatients.forEach((patient:any) => {
      patient.appointments.forEach((appointment: any) => {
        if(appointment.id === this.appointmentToAssign.id) {
          appointment['assignedDoctorDetails'] = this.appointmentAssignFormData.doctor;
          appointment['doctorNames'] = this.appointmentAssignFormData.doctor.firstName + ' ' + this.appointmentAssignFormData.doctor.lastName; 
          appointment.status = 'accepted';
          appointment.appointmentDate = this.appointmentAssignFormData.date;
          this.sharedService.store('patients','local',this.allPatients);
        }
      } )
    })

    // Update appointments array
    this.allAppointments.forEach((appointment: any) => {
      if(appointment.id === this.appointmentToAssign.id) {
        appointment['assignedDoctorDetails'] = this.appointmentAssignFormData.doctor;
        appointment['doctorNames'] = this.appointmentAssignFormData.doctor.firstName + ' ' + this.appointmentAssignFormData.doctor.lastName;
        appointment.status = 'accepted';
        appointment.appointmentDate = this.appointmentAssignFormData.date;
        this.sharedService.store('appointments','local',this.allAppointments);
        this.sharedService.updateAppointments(this.allAppointments);
      }
    })
    this.snackbar.open('Appointment with doctor scheduled successfully','Ok',{duration: 3000});
    this.dialogRef.close()
  }

  close(){
    this.dialogRef.close()
  }
}
