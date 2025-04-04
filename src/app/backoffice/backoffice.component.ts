import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivitiesComponent } from '../backoffice-activity/backoffice-activity.component';
import { UsersComponent } from '../backoffice-user/backoffice-user.component';
import { AuthService } from '../services/auth.service'; // Adjust the path as needed

@Component({
  selector: 'app-backoffice',
  templateUrl: './backoffice.component.html',
  styleUrls: ['./backoffice.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ActivitiesComponent, UsersComponent]
})
export class BackOfficeComponent implements OnInit {
  
  // Nova propietat per controlar la pestanya activa
  activeTab: string = 'users';

  constructor(private authService: AuthService) {}

  logout() {
    console.log('BackOfficeComponent: Cerrando sesión y redirigiendo al login');
    this.authService.logout();
  }
  
  ngOnInit(): void {
  }

  // Mètode per canviar entre pestanyes
  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}