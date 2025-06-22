import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule } from '@angular/router'; // Para router-outlet y routerLink

@Component({
  selector: 'app-settings-profile',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './settings-profile.component.html',
  styleUrls: ['./settings-profile.component.css']
})
export class SettingsProfileComponent {
  constructor() { }
}
