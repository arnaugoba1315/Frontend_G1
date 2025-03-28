import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivityService } from '../services/activity.service';
import { UserService } from '../services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { Activity } from '../models/activity.model';
import { ActivityCreateComponent } from '../components/activity-create/activity-create.component';

@Component({
  selector: 'app-activities',
  templateUrl: './backoffice-activity.component.html',
  styleUrls: ['./backoffice-activity.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ActivityCreateComponent]
})
export class ActivitiesComponent implements OnInit {
  activities: any[] = [];
  filteredActivities: any[] = [];
  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 0;
  totalActivities = 0;
  pages: number[] = [];
  loading = false;
  error = '';
  activitiesListed = false;
  showCreateModal = false;
  showEditModal = false;
  showViewModal = false;
  selectedActivity: any = null;
  selectedType: string = '';
  
  formattedStartTime: string = '';
  formattedEndTime: string = '';
  
  // dades d'exeemple
  allMockActivities: any[] = [
    { 
      _id: '1', 
      name: 'Running en el parque', 
      author: '1', 
      authorName: 'Usuario1',
      startTime: new Date('2025-03-20T08:00:00'), 
      endTime: new Date('2025-03-20T09:00:00'), 
      duration: 60, 
      distance: 8000, 
      elevationGain: 50, 
      averageSpeed: 8, 
      caloriesBurned: 400, 
      type: 'running' 
    },
    { 
      _id: '2', 
      name: 'Ciclismo de montaña', 
      author: '2', 
      authorName: 'Usuario2',
      startTime: new Date('2025-03-21T10:00:00'), 
      endTime: new Date('2025-03-21T12:00:00'), 
      duration: 120, 
      distance: 30000, 
      elevationGain: 500, 
      averageSpeed: 15, 
      caloriesBurned: 800, 
      type: 'cycling' 
    },
    { 
      _id: '3', 
      name: 'Caminata al lago', 
      author: '3', 
      authorName: 'Usuario3',
      startTime: new Date('2025-03-22T15:00:00'), 
      endTime: new Date('2025-03-22T17:00:00'), 
      duration: 120, 
      distance: 6000, 
      elevationGain: 120, 
      averageSpeed: 3, 
      caloriesBurned: 300, 
      type: 'hiking' 
    },
    { 
      _id: '4', 
      name: 'Carrera matutina', 
      author: '1', 
      authorName: 'Usuario1',
      startTime: new Date('2025-03-23T07:00:00'), 
      endTime: new Date('2025-03-23T07:45:00'), 
      duration: 45, 
      distance: 7500, 
      elevationGain: 30, 
      averageSpeed: 10, 
      caloriesBurned: 350, 
      type: 'running' 
    },
    { 
      _id: '5', 
      name: 'Paseo por la ciudad', 
      author: '2', 
      authorName: 'Usuario2',
      startTime: new Date('2025-03-24T18:00:00'), 
      endTime: new Date('2025-03-24T19:00:00'), 
      duration: 60, 
      distance: 4000, 
      elevationGain: 20, 
      averageSpeed: 4, 
      caloriesBurned: 200, 
      type: 'walking' 
    },
    { 
      _id: '6', 
      name: 'Ruta en bicicleta', 
      author: '3', 
      authorName: 'Usuario3',
      startTime: new Date('2025-03-25T09:00:00'), 
      endTime: new Date('2025-03-25T11:30:00'), 
      duration: 150, 
      distance: 40000, 
      elevationGain: 300, 
      averageSpeed: 16, 
      caloriesBurned: 1000, 
      type: 'cycling' 
    },
  ];
  
  constructor(
    private activityService: ActivityService,
    private userService: UserService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    // Para cargar automáticamente las actividades al iniciar la aplicación:
    // this.obtenerActividades();
  }

  obtenerActividades(): void {
    this.loading = true;
    
    this.activityService.getActivities(this.currentPage, this.itemsPerPage)
      .subscribe({
        next: (response) => {
          console.log('Actividades cargadas:', response);
          
          if (response && Array.isArray(response)) {
            // Si la respuesta es directamente un array de actividades
            this.activities = response;
            this.totalActivities = response.length;
            // Puedes necesitar ajustar cómo obtienes el total de páginas
            this.totalPages = Math.ceil(this.totalActivities / this.itemsPerPage);
          } else if (response && response.activities) {
            // Si la respuesta es un objeto con una propiedad 'activities'
            this.activities = response.activities;
            this.totalActivities = response.totalActivities || response.activities.length;
            this.totalPages = response.totalPages || Math.ceil(this.totalActivities / this.itemsPerPage);
          } else {
            // Fallback a datos de simulación si no hay datos
            console.log('No se encontraron actividades, usando datos de simulación');
            this.simularPaginacion();
          }
          
          this.loadAuthorNames();
          
          this.filteredActivities = [...this.activities];
          this.generatePageNumbers();
          this.loading = false;
          this.activitiesListed = true;
        },
        error: (err) => {
          console.error('Error al cargar actividades:', err);
          this.error = 'Error al cargar actividades';
          this.loading = false;
          
          // En caso de error, simulamos paginación con datos de prueba
          this.simularPaginacion();
          this.filteredActivities = [...this.activities];
          this.generatePageNumbers();
          this.activitiesListed = true;
        }
      });
  }

  loadAuthorNames(): void {
    this.activities.forEach(activity => {
      if (activity.author) {
        this.userService.getUserById(activity.author).subscribe({
          next: (user) => {
            activity.authorName = user ? user.username : 'Desconocido';
          },
          error: () => {
            activity.authorName = 'Desconocido';
          }
        });
      } else {
        activity.authorName = 'Desconocido';
      }
    });
  }

  // Métode per simular la paginació amb dades de proba
  simularPaginacion(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = Math.min(startIndex + this.itemsPerPage, this.allMockActivities.length);
    
    // Obtenir las activitats de la pàgina actual
    this.activities = this.allMockActivities.slice(startIndex, endIndex);
    
    // Calcular el total
    this.totalActivities = this.allMockActivities.length;
    this.totalPages = Math.ceil(this.totalActivities / this.itemsPerPage);
  }

  generatePageNumbers(): void {
    this.pages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      this.pages.push(i);
    }
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) {
      return;
    }
    this.currentPage = page;
    this.obtenerActividades();
  }
  
  // Filtrar activitats per tipus
  filterActivities(): void {
    if (!this.selectedType) {
      this.filteredActivities = [...this.activities];
    } else {
      this.filteredActivities = this.activities.filter(activity => 
        activity.type === this.selectedType
      );
    }
  }

  showCreateActivityForm(): void {
    this.showCreateModal = true;
    this.showEditModal = false;
    this.showViewModal = false;
    this.selectedActivity = null;
  }

  editarActividad(activity: any): void {
    console.log('Editar actividad:', activity);
    this.selectedActivity = { ...activity }; // Crear una copia para no modificar la original
    
    this.formattedStartTime = this.formatDateTimeForInput(activity.startTime);
    this.formattedEndTime = this.formatDateTimeForInput(activity.endTime);
    
    this.showEditModal = true;
    this.showCreateModal = false;
    this.showViewModal = false;
  }

  eliminarActividad(activity: any): void {
    console.log('Eliminar actividad:', activity);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: `¿Estás seguro de que deseas eliminar la actividad "${activity.name}"?` }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.activityService.deleteActivity(activity._id).subscribe({
          next: () => {
            console.log(`Actividad ${activity._id} eliminada`);
            
            // Eliminar la activitat de les notres dades de prova també
            const index = this.allMockActivities.findIndex(a => a._id === activity._id);
            if (index !== -1) {
              this.allMockActivities.splice(index, 1);
            }
            
            this.obtenerActividades(); // Recargar la llista després d'eliminar
          },
          error: (error) => {
            console.error('Error al eliminar actividad:', error);
          }
        });
      }
    });
  }

  verDetallesActividad(activity: any): void {
    console.log('Ver detalles de actividad:', activity);
    this.selectedActivity = { ...activity }; // Crear una copia para no modificar la original
    this.showViewModal = true;
    this.showEditModal = false;
    this.showCreateModal = false;
  }

  onActivityCreated(success: boolean): void {
    this.showCreateModal = false;
    if (success) {
      this.obtenerActividades(); // Recargar la llista després de crear una nova activitat
    }
  }

  onActivityEdited(success: boolean): void {
    if (success && this.selectedActivity) {
      // Actualitzar dates desde els camps formatejats
      this.selectedActivity.startTime = new Date(this.formattedStartTime);
      this.selectedActivity.endTime = new Date(this.formattedEndTime);
      
      // Actualitzar la activitat en el backend
      this.activityService.updateActivity(this.selectedActivity._id, this.selectedActivity).subscribe({
        next: () => {
          console.log(`Actividad ${this.selectedActivity?._id} actualizada correctamente`);
          this.showEditModal = false;
          this.obtenerActividades(); // Recargar la llista
        },
        error: (error) => {
          console.error('Error al actualizar actividad:', error);
        }
      });
    } else {
      this.showEditModal = false;
    }
  }

  closeViewModal(): void {
    this.showViewModal = false;
    this.selectedActivity = null;
  }

  formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins}min`;
    } else {
      return `${mins}min`;
    }
  }
  
  // Formatejar la data per input datetime-local
  formatDateTimeForInput(dateStr: string): string {
    // Convertir la data de string a objecte Date
    const date = new Date(dateStr);
    
    // Format YYYY-MM-DDThh:mm 
    return date.toISOString().slice(0, 16);
  }
  trackByActivityId(index: number, activity: any): string {
    return activity._id;
  }
}