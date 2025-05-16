// src/app/myprofile-worker/myprofile-worker-component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderBarComponent } from '../public/components/header-bar/header-bar.component';

export interface UserProfile {
  name: string;
  lastName: string;
  documentType: string;
  documentNumber: string;
  birthDate: Date;
  gender: string;
  phone: string;
  country: string;
  city: string;
  address: string;
  email: string;
  registrationDate: Date;

  about: string;
  experiences: string;
  skills: string;
  educationLevel: string;
  languages: string;
  notifyViews: boolean;
  authorizeData: boolean;
}

@Component({
  selector: 'app-myprofile-worker',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HeaderBarComponent
  ],
  templateUrl: './myprofile-worker-component.html',
  styleUrls: ['./myprofile-worker-component.css']
})
export class MyprofileWorkerComponent {
  activeTab: 'datos' | 'acerca' = 'datos';
  userType: 'cliente' | 'trabajador' = 'trabajador';

  educationLevels = [
    'Secundaria completa',
    'Técnico',
    'Universitario incompleto',
    'Universitario completo',
    'Postgrado'
  ];

  user: UserProfile = {
    name: 'Jane',
    lastName: 'Cooper',
    documentType: 'DNI',
    documentNumber: '77894567',
    birthDate: new Date('1997-08-15'),
    gender: 'Femenino',
    phone: '987568741',
    country: 'Perú',
    city: 'Lima',
    address: 'Av. Primavera 567. Dpto F-104',
    email: 'janecooper@gmail.com',
    registrationDate: new Date('2022-04-17'),

    about: '',
    experiences: '',
    skills: '',
    educationLevel: '',
    languages: '',
    notifyViews: false,
    authorizeData: false
  };

  setUserType(type: 'cliente' | 'trabajador'): void {
    this.userType = type;
    // Aquí podrías recargar datos si cambias de cliente a trabajador
  }

  save(): void {
    // Lógica para enviar los cambios al backend
    console.log('Guardando perfil:', this.user);
  }
}
