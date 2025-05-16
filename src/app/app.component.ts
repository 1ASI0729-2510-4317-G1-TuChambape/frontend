import { Component }     from '@angular/core';
import { RouterModule }  from '@angular/router';

import { SideNavigationBarComponent } from './public/components/side-navigation-bar/side-navigation-bar.component';
import { HeaderBarComponent }         from './public/components/header-bar/header-bar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterModule,
    SideNavigationBarComponent,

  ],
  templateUrl: './app.component.html',
  styleUrls:   ['./app.component.css']
})
export class AppComponent {}
