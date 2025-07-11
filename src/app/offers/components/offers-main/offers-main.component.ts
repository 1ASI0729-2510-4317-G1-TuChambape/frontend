import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule } from '@angular/router';

@Component({
  selector: 'app-offers-main',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './offers-main.component.html',
  styleUrls: ['./offers-main.component.css']
})
export class OffersMainComponent {
  constructor() { }
}
