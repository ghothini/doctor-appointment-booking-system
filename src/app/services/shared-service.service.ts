import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedServiceService {
  allAppointments: any;
  patientAppointment: any;
  appointmentsSubject = new Subject<any>();
  patientAppointmentSubject = new Subject<any>();

  updateAppointments(appointments: any): void {
    this.allAppointments = appointments;
    console.log(this.allAppointments)
    this.appointmentsSubject.next(this.allAppointments);
  }

  updatePatientAppointment(appointment: any): void {
    this.patientAppointment = appointment.reverse();
    console.log(this.patientAppointment)
    this.patientAppointmentSubject.next(this.patientAppointment);
  }

  watchPatientAppointment(): Observable<any> {
    return this.patientAppointmentSubject.asObservable()
  }

  watchAppointments(): Observable<any> {
    return this.appointmentsSubject.asObservable()
  }

  store(key: string, storage: string, data: any) {
    if (storage === 'session') {
      sessionStorage.setItem(key, JSON.stringify(data));
      return;
    }
    localStorage.setItem(key, JSON.stringify(data));
  }

  fetch(key: string, storage: string): any {
    if (storage === 'session') {
      const toReturn = sessionStorage.getItem(key);
      return toReturn ? JSON.parse(toReturn) : [];
    } else {
      const toReturn = localStorage.getItem(key);
      return toReturn ? JSON.parse(toReturn) : [];
    }
  }

  setDoctor(doctor: any): void {
    let allDoctors: any = localStorage.getItem('doctors');
    allDoctors = allDoctors ? JSON.parse(allDoctors) : [];
    allDoctors.push(doctor);
    localStorage.setItem('doctors', JSON.stringify(allDoctors));
  }
}
