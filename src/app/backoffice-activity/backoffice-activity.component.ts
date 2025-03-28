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

  paginatedActivities: any[] = [];

  obtenerActividades(): void {
    this.loading = true;
    
    this.activityService.getActivities(this.currentPage, this.itemsPerPage)
      .subscribe({
        next: (response) => {
          console.log('Datos recibidos del servidor:', response);
          
          if (Array.isArray(response)) {
            this.activities = response;
            this.totalActivities = response.length;
            this.totalPages = Math.ceil(this.totalActivities / this.itemsPerPage);
          } else if (response && response.activities) {
            this.activities = response.activities;
            this.totalActivities = response.totalUsers || response.activities.length;
            this.totalPages = response.totalPages || Math.ceil(this.totalActivities / this.itemsPerPage);
          } else {
            console.warn('No se recibieron actividades del servidor');
            this.activities = this.allMockActivities.slice(0, this.itemsPerPage);
            this.totalActivities = this.allMockActivities.length;
            this.totalPages = Math.ceil(this.totalActivities / this.itemsPerPage);
          }
          
          // Preprocesar las actividades para asegurar que el campo author sea una cadena
          this.activities = this.activities.map(activity => {
            // Manejar los casos donde el autor puede venir como objeto o como string
            if (activity.author && typeof activity.author === 'object' && activity.author._id) {
              // Si el autor viene como objeto, guardamos el ID como string
              const authorId = activity.author._id;
              const authorName = activity.author.username || 'Desconegut';
              return { ...activity, author: authorId, authorName: authorName };
            }
            return activity;
          });
          
          // Ahora cargar los nombres de los autores para los que solo tenemos ID
          this.loadAuthorNames();
          
          this.filteredActivities = [...this.activities];
          this.generatePageNumbers();
          this.updatePaginatedActivities();
          this.loading = false;
          this.activitiesListed = true;
        },
        error: (err) => {
          console.error('Error al cargar actividades:', err);
          this.error = 'Error al cargar actividades';
          this.loading = false;
          
          // En caso de error, usar datos de ejemplo
          this.activities = this.allMockActivities.slice(0, this.itemsPerPage);
          this.filteredActivities = [...this.activities];
          this.totalActivities = this.allMockActivities.length;
          this.totalPages = Math.ceil(this.totalActivities / this.itemsPerPage);
          this.generatePageNumbers();
          this.updatePaginatedActivities();
          this.activitiesListed = true;
        }
      });
  }

  loadAuthorNames(): void {
    // Crear un mapa para almacenar los autores por ID y evitar solicitudes duplicadas
    const userPromises: {[key: string]: Promise<any>} = {};
    
    this.activities.forEach(activity => {
      if (activity.author && typeof activity.author === 'string') {
        // Solo crear una promesa por cada ID de usuario único
        if (!userPromises[activity.author]) {
          userPromises[activity.author] = new Promise((resolve) => {
            this.userService.getUserById(activity.author as string).subscribe({
              next: (user) => resolve(user),
              error: () => resolve(null)
            });
          });
        }
        
        // Usar la promesa para asignar el nombre del autor
        userPromises[activity.author].then(user => {
          activity.authorName = user ? user.username : 'Desconegut';
        });
      } else {
        activity.authorName = 'Desconegut';
      }
    });
  }

  // Métode per simular la paginació amb dades de proba
  simularPaginacion(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = Math.min(startIndex + this.itemsPerPage, this.allMockActivities.length);
    
    this.activities = this.allMockActivities.slice(startIndex, endIndex);
    this.filteredActivities = [...this.activities];
    this.updatePaginatedActivities(); // Update paginated activities here
    
    this.totalActivities = this.allMockActivities.length;
    this.totalPages = Math.ceil(this.totalActivities / this.itemsPerPage);
  }

  updatePaginatedActivities(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedActivities = this.filteredActivities.slice(startIndex, endIndex);
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
    this.updatePaginatedActivities();
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
    this.currentPage = 1; // Reset to the first page after filtering
    this.updatePaginatedActivities();
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
    
    // Si la actividad tiene un ID válido, intentar cargar desde el servidor con detalles del autor
    if (activity._id) {
      this.loading = true;
      
      // Primero guardamos los datos básicos que ya tenemos
      this.selectedActivity = { ...activity };
      
      // Si ya tenemos la información del autor en formato objeto, extraer directamente el nombre
      if (this.selectedActivity.author && typeof this.selectedActivity.author === 'object') {
        if (this.selectedActivity.author.username) {
          this.selectedActivity.authorName = this.selectedActivity.author.username;
        }
      }
      
      this.showViewModal = true;
      
      // Después intentamos obtener datos más completos del servidor
      this.activityService.getActivityById(activity._id).subscribe({
        next: (detailedActivity) => {
          console.log('Datos detallados de actividad:', detailedActivity);
          
          // Crear una copia para no perder los datos que ya tenemos
          const updatedActivity = { ...this.selectedActivity };
          
          // Actualizar con los nuevos datos manteniendo el nombre del autor si lo tenemos
          Object.assign(updatedActivity, detailedActivity);
          
          // Manejar específicamente el campo author que puede ser un objeto o un string
          if (detailedActivity.author) {
            if (typeof detailedActivity.author === 'object') {
              // Si el autor es un objeto, extraer el nombre de usuario
              if (detailedActivity.author.username) {
                updatedActivity.authorName = detailedActivity.author.username;
              }
              // Guardamos la referencia al autor pero de forma limpia
              updatedActivity.authorId = detailedActivity.author._id;
            } else if (typeof detailedActivity.author === 'string') {
              // Si es un string, es el ID del autor, cargamos el usuario
              updatedActivity.authorId = detailedActivity.author;
              
              this.userService.getUserById(detailedActivity.author).subscribe({
                next: (user) => {
                  if (user && user.username) {
                    updatedActivity.authorName = user.username;
                    this.selectedActivity = updatedActivity;
                  }
                },
                error: () => {
                  // Mantener lo que ya teníamos
                }
              });
            }
          }
          
          // Actualizar el estado con los datos procesados
          this.selectedActivity = updatedActivity;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error al cargar detalles de la actividad:', error);
          // Mantenemos los datos que ya teníamos
          this.loading = false;
        }
      });
    } else {
      // Si no hay ID, simplemente mostrar los datos que ya tenemos
      this.selectedActivity = { ...activity };
      // Procesar el autor si es un objeto
      if (this.selectedActivity.author && typeof this.selectedActivity.author === 'object') {
        if (this.selectedActivity.author.username) {
          this.selectedActivity.authorName = this.selectedActivity.author.username;
        }
      }
      this.showViewModal = true;
    }
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
    
    // Si se hicieron cambios durante la visualización, actualizar la lista
    if (this.activitiesListed) {
      this.obtenerActividades();
    }
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