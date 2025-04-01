import { Component, Input, OnInit } from '@angular/core';


import { CommonModule } from '@angular/common';
import { ActivityHistory } from '../models/activity-history.model';
import { ActivityHistoryService } from '../services/activity-history.service';

@Component({
  selector: 'app-activity-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './activity-history.component.html',
  styleUrls: ['./activity-history.component.css']
})
export class ActivityHistoryComponent implements OnInit {
  @Input() activityId?: string;
  
  histories: ActivityHistory[] = [];
  loading = false;
  error = '';
  
  // Paginación
  currentPage = 1;
  totalPages = 1;
  totalItems = 0;
  itemsPerPage = 10;
  selectedHistoryId: string | null = null;

  toggleDetails(history: ActivityHistory): void {
    this.selectedHistoryId = this.selectedHistoryId === history._id ? null : history._id;
  }
  

  isSelected(history: ActivityHistory): boolean {
    return this.selectedHistoryId === history._id;
  }
  constructor(private activityHistoryService: ActivityHistoryService) { }
  
  getChangedFieldsText(history: ActivityHistory): string {
    if (!history.changedFields || history.changedFields.length === 0) {
      return '-';
    }
    return history.changedFields.join(', '); 
    }
  ngOnInit(): void {
    if (this.activityId) {
      this.loadHistoryForActivity();
    } else {
      this.loadAllHistory();
    }
  }
  
  loadHistoryForActivity(): void {
    if (!this.activityId) return;
    
    this.loading = true;
    this.activityHistoryService.getHistoryByActivityId(this.activityId, this.currentPage, this.itemsPerPage)
      .subscribe({
        next: (response) => {
          this.histories = response.histories;
          this.totalItems = response.total;
          this.totalPages = response.pages;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Error al cargar el historial';
          this.loading = false;
          console.error('Error loading activity history:', err);
        }
      });
  }
  
  loadAllHistory(): void {
    this.loading = true;
    this.activityHistoryService.getAllHistory(this.currentPage, this.itemsPerPage)
      .subscribe({
        next: (response) => {
          this.histories = response.histories;
          this.totalItems = response.total;
          this.totalPages = response.pages;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Error al cargar el historial';
          this.loading = false;
          console.error('Error loading activity history:', err);
        }
      });
  }
  
  onPageChange(page: number): void {
    if (page > 0 && page <= this.totalPages) {
      this.currentPage = page;
      if (this.activityId) {
        this.loadHistoryForActivity();
      } else {
        this.loadAllHistory();
      }
    }
  }

  getChangeTypeLabel(changeType: string): string {
    switch (changeType) {
      case 'create': return 'Creación';
      case 'update': return 'Actualización';
      case 'delete': return 'Eliminación';
      default: return changeType;
    }
  }
  getUserName(history: ActivityHistory): string {
    if (history && history.userId && history.userId.username) {
      return history.userId.username;
    }
    return 'Usuario desconocido';
  }
}