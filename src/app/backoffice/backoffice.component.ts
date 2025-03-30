import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivitiesComponent } from '../backoffice-activity/backoffice-activity.component';
import { UsersComponent } from '../backoffice-user/backoffice-user.component';

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
  
  constructor(
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
  }

  // Mètode per canviar entre pestanyes
  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}