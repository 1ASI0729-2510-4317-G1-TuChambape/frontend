// src/app/app.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MyProfileComponent } from './components/client/my-profile/my-profile.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,

    MyProfileComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend';
}
