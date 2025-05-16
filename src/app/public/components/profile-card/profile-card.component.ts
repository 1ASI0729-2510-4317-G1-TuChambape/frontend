// src/app/public/components/profile-card/profile-card.component.ts

import { Component, Input } from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule }    from '@angular/forms';
import { SliderModule }   from 'primeng/slider';
import { BadgeModule }    from 'primeng/badge';
import { CardModule }     from 'primeng/card';    // ← Importa CardModule

export interface Profile {
  name: string;
  photoUrl: string;
  role: string;
  availability: [number, number];               // tuple de dos números
  rating: number;
  ratingCount: number;
  certification: string;
  experienceYears: number;
  favorite: boolean;
}

@Component({
  selector: 'app-profile-card',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SliderModule,
    BadgeModule,
    CardModule                               // ← Agrégalo aquí
  ],
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.css']
})
export class ProfileCardComponent {
  @Input() profile!: Profile;
}
