import { Component }                from '@angular/core';
import { CommonModule }             from '@angular/common';
import { SideNavigationBarComponent } from './public/components/side-navigation-bar/side-navigation-bar.component';
import { HeaderBarComponent }       from './public/components/header-bar/header-bar.component';
import { RouterOutlet }             from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    SideNavigationBarComponent,
    RouterOutlet
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {}
