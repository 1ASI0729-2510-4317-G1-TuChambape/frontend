import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule } from '@angular/router';
import { UserSessionService } from '../../services/user-session.service';

@Component({
  selector: 'app-settings-profile',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './settings-profile.component.html',
  styleUrls: ['./settings-profile.component.css']
})
export class SettingsProfileComponent {
  constructor() { }
  role: string = '';

  userSessionService: UserSessionService = inject(UserSessionService);

  ngOnInit(): void {
    const account = this.userSessionService.getCurrentAccount();
    if (account) {
      this.role = account.role;
    }
  }
}
