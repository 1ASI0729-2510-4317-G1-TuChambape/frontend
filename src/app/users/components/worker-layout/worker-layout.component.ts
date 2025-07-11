import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule } from '@angular/router';
import { UserSessionService } from '../../services/user-session.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-worker-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './worker-layout.component.html',
  styleUrls: ['./worker-layout.component.css']
})
export class WorkerLayoutComponent {
  userName: string = 'Técnico';
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