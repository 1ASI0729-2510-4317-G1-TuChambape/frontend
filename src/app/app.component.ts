import { Component }    from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { HeaderBarComponent }
  from './public/components/header-bar/header-bar.component';
import { SideNavigationBarComponent }
  from './public/components/side-navigation-bar/side-navigation-bar.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    SideNavigationBarComponent,
    HeaderBarComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {}
