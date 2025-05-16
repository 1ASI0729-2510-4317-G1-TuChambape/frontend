// src/app/compare-profiles/compare-profiles.component.ts
import { Component }    from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }  from '@angular/forms';

import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule }   from 'primeng/button';

import { SideNavigationBarComponent }
  from '../public/components/side-navigation-bar/side-navigation-bar.component';
import { HeaderBarComponent }
  from '../public/components/header-bar/header-bar.component';
import { ProfileCardComponent, Profile }
  from '../public/components/profile-card/profile-card.component';

@Component({
  selector: 'app-compare-profiles',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,

    CheckboxModule,   // para p-checkbox
    DropdownModule,   // para p-dropdown
    ButtonModule,     // para pButton

    // tus shell components
    SideNavigationBarComponent,
    HeaderBarComponent,

    // el componente de card
    ProfileCardComponent
  ],
  templateUrl: './compare-profiles.component.html',
  styleUrls: ['./compare-profiles.component.css']
})
export class CompareProfilesComponent {
  onlyFav = false;
  selectedRole: string | null                = null;
  selectedAvailability: [number,number] | null = null;
  selectedRating: number | null              = null;
  selectedCertification: string | null       = null;
  selectedExperience: number | null          = null;

  roles = [
    { label: 'Electricista', value: 'Electricista' },
    { label: 'Plomero',     value: 'Plomero'     },
    { label: 'Carpintero',  value: 'Carpintero'  }
  ];
  availabilityOptions = [
    { label: 'Todas',         value: null },
    { label: '8:00–12:00',    value: [8,12]   as [number,number] },
    { label: '12:00–16:00',   value: [12,16]  as [number,number] },
    { label: '16:00–20:00',   value: [16,20]  as [number,number] }
  ];
  ratingOptions = [
    { label: '≥ 0',   value: 0 },
    { label: '≥ 3',   value: 3 },
    { label: '≥ 4',   value: 4 },
    { label: '≥ 4.5', value: 4.5 }
  ];
  certificationOptions = [
    { label: 'Institución técnica',   value: 'Institución técnica' },
    { label: 'Técnico certificado',   value: 'Técnico certificado' },
    { label: 'Formación autodidacta', value: 'Formación autodidacta' }
  ];
  experienceOptions = [
    { label: 'Cualquiera', value: null },
    { label: '≥ 5 años',   value: 5 },
    { label: '≥ 10 años',  value: 10 },
    { label: '≥ 15 años',  value: 15 }
  ];

  profiles: Profile[] = [
    {
      name: 'Juan González',
      photoUrl: '/assets/juan.jpg',
      role: 'Electricista',
      availability: [11,14] as [number,number],
      rating: 4.7,
      ratingCount: 200,
      certification: 'Técnico certificado',
      experienceYears: 14,
      favorite: true
    },
    {
      name: 'Teodoro Casanova',
      photoUrl: '/assets/teodoro.jpg',
      role: 'Electricista',
      availability: [11,14] as [number,number],
      rating: 4.7,
      ratingCount: 200,
      certification: 'Formación autodidacta',
      experienceYears: 12,
      favorite: false
    },
    {
      name: 'Gracia Espinoza',
      photoUrl: '/assets/gracia.jpg',
      role: 'Electricista',
      availability: [11,14] as [number,number],
      rating: 4.7,
      ratingCount: 200,
      certification: 'Institución técnica',
      experienceYears: 13,
      favorite: false
    }
  ];

  filteredProfiles(): Profile[] {
    return this.profiles.filter(p =>
      (!this.onlyFav || p.favorite) &&
      (!this.selectedRole || p.role === this.selectedRole) &&
      (!this.selectedAvailability ||
        p.availability[0] >= this.selectedAvailability[0] &&
        p.availability[1] <= this.selectedAvailability[1]) &&
      (!this.selectedRating || p.rating >= this.selectedRating) &&
      (!this.selectedCertification || p.certification === this.selectedCertification) &&
      (!this.selectedExperience || p.experienceYears >= this.selectedExperience)
    );
  }
}
