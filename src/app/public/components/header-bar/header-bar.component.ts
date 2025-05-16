import { Component, Input }  from '@angular/core';
import { CommonModule }       from '@angular/common';

@Component({
  selector: 'app-header-bar',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './header-bar.component.html',
  styleUrls: ['./header-bar.component.css']
})
export class HeaderBarComponent {
  @Input() title = '';
}
