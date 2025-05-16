// src/app/settings/settings.component.ts

import { Component, OnInit }          from '@angular/core';
import { CommonModule }               from '@angular/common';
import { FormsModule }                from '@angular/forms';
import { RouterModule }               from '@angular/router';

import { InputSwitchModule }          from 'primeng/inputswitch';
import { InputTextModule }            from 'primeng/inputtext';
import { ButtonModule }               from 'primeng/button';

import { SideNavigationBarComponent } from '../public/components/side-navigation-bar/side-navigation-bar.component';
import { HeaderBarComponent }         from '../public/components/header-bar/header-bar.component';

interface UserInfo {
  profilePicture: File | null;
  name: string;
  username: string;
  email: string;
  facebookConnect: boolean;
  googleConnect: boolean;
  webEffects: boolean;
  animation: boolean;
  allowLocation: boolean;
  listeningExercises: boolean;
}

interface PersonalInfo {
  address: string;
  phone: string;
  language: string;
}

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    InputSwitchModule,
    InputTextModule,
    ButtonModule,
    SideNavigationBarComponent,
    HeaderBarComponent
  ],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  // Ahora prop es keyof UserInfo, no string genérico
  toggles: { label: string; prop: keyof UserInfo }[] = [
    { label: 'Facebook Connect',    prop: 'facebookConnect'    },
    { label: 'Google+ Connect',     prop: 'googleConnect'      },
    { label: 'Efectos Web',         prop: 'webEffects'         },
    { label: 'Animación',           prop: 'animation'          },
    { label: 'Permitir Ubicación',  prop: 'allowLocation'      },
    { label: 'Listening exercises', prop: 'listeningExercises' }
  ];

  user: UserInfo = {
    profilePicture: null,
    name: 'James Cooper',
    username: 'JCopper12',
    email: 'hello@designdrops.io',
    facebookConnect: false,
    googleConnect: true,
    webEffects: true,
    animation: true,
    allowLocation: false,
    listeningExercises: true
  };

  personal: PersonalInfo = {
    address: '',
    phone: '',
    language: ''
  };

  cardMask    = '**** 4578';
  creditName  = 'Jane Cooper';
  currentPlan = 'Plan Standard';

  ngOnInit(): void {
    // Aquí cargarías datos reales si es necesario
  }

  onProfilePicChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.user.profilePicture = input.files[0];
    }
  }

  saveChanges()    { console.log('Guardando cambios', this.user, this.personal); }
  changePlan()     { console.log('Cambiar plan'); }
  logout()         { console.log('Logout'); }
  exportData()     { console.log('Exportar datos'); }
  deleteAccount()  { console.log('Eliminar cuenta'); }
}
