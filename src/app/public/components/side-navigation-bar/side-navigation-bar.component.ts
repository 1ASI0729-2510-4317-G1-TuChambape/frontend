// src/app/public/components/side-navigation-bar/side-navigation-bar.component.ts
import { Component }   from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-side-navigation-bar',
  standalone: true,              // marca standalone
  imports: [RouterModule],        // para poder usar routerLink
  templateUrl: './side-navigation-bar.component.html',
  styleUrls: ['./side-navigation-bar.component.css']
})
export class SideNavigationBarComponent {}
