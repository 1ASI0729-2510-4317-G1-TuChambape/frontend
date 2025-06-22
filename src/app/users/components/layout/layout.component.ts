import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule } from '@angular/router';
import { UserSessionService } from '../../services/user-session.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent { // Renombrado de ClientLayoutComponent para coincidir con el selector y el archivo
  userName: string = 'James Cooper';
  userEmail: string | null = null;

  constructor(private userSessionService: UserSessionService, private router: Router) {}

  ngOnInit() {
    this.userEmail = this.userSessionService.getCurrentAccount()?.email || '';
  }

  logout() {
    this.userSessionService.logout();
    this.router.navigate(['/login']);
  }
}
