// src/app/components/client/my-profile/my-profile.component.ts
import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileDatosComponent } from './profile-datos/profile-datos.component';
import { ProfilePreferenciasComponent } from './profile-preferencias/profile-preferencias.component';

@Component({
  selector: 'app-my-profile',
  standalone: true,
  imports: [
    CommonModule,
    ProfileDatosComponent,
    ProfilePreferenciasComponent
  ],
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css']
})
export class MyProfileComponent implements OnInit {
  activeTab: string = 'datos'; // Pestaña activa por defecto

  // ViewChild nos da acceso a la instancia del componente hijo
  @ViewChild(ProfileDatosComponent) profileDatosComponent!: ProfileDatosComponent;
  @ViewChild(ProfilePreferenciasComponent) profilePreferenciasComponent!: ProfilePreferenciasComponent;

  constructor() { }

  ngOnInit(): void {
    console.log('MyProfileComponent inicializado.');
  }

  selectTab(tabName: string): void {
    this.activeTab = tabName;
    console.log('Pestaña seleccionada:', this.activeTab);
  }

  saveChanges(): void {
    if (this.activeTab === 'datos') {
      if (this.profileDatosComponent) {

        this.profileDatosComponent.onSubmit();
      } else {
        console.error('ProfileDatosComponent no está disponible.');
      }
    } else if (this.activeTab === 'preferencias') {
      if (this.profilePreferenciasComponent) {

        this.profilePreferenciasComponent.onSubmit();
      } else {
        console.error('ProfilePreferenciasComponent no está disponible.');
      }
    }
  }
}
