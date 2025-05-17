import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-star-rating',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './start-rating.component.html',
  styleUrls: ['./start-rating.component.css'],
})
export class StarRatingComponent {
  @Input() rating = 0;
  Math = Math;
}
