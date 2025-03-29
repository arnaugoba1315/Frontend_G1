import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivityService } from '../../services/activity.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-activity-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './activity-create.component.html',
  styleUrls: ['./activity-create.component.css']
})
export class ActivityCreateComponent implements OnInit {
  activityForm: FormGroup;
  users: any[] = [];
  loading = false;
  error = '';
  
  @Output() activityCreated = new EventEmitter<boolean>();
  
  constructor(
    private formBuilder: FormBuilder,
    private activityService: ActivityService,
    private userService: UserService
  ) {
    this.activityForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      author: ['', [Validators.required]],
      type: ['running', [Validators.required]],
      startTime: ['', [Validators.required]],
      endTime: ['', [Validators.required]],
      duration: [0, [Validators.required, Validators.min(1)]],
      distance: [0, [Validators.required, Validators.min(1)]],
      elevationGain: [0, [Validators.required, Validators.min(0)]],
      averageSpeed: [0, [Validators.required, Validators.min(0)]],
      caloriesBurned: [null],
      // Inicializamos route y musicPlaylist como arrays vacíos
      route: [[]],
      musicPlaylist: [[]]
    });
  }
  
  ngOnInit(): void {
    this.loadUsers();
  }
  
  loadUsers(): void {
    this.loading = true;
    
    this.userService.getUsers(1, 100, true)
      .subscribe({
        next: (response) => {
          this.loading = false;
          
          if (response && response.users && response.users.length > 0) {
            this.users = response.users;
            console.log('Usuarios cargados:', this.users);
          } else {
            console.warn('No se encontraron usuarios en la base de datos');
            this.error = 'No se encontraron usuarios para asignar como autores';
          }
        },
        error: (err) => {
          this.loading = false;
          console.error('Error cargando usuarios:', err);
          this.error = 'Error al cargar la lista de usuarios';
        }
      });
  }
  
  onSubmit(): void {
    if (this.activityForm.invalid) {
      this.activityForm.markAllAsTouched();
      return;
    }
    
    this.loading = true;
    this.error = '';
    
    const formData = this.activityForm.value;
    
    // Crear estructura de datos correcta para el backend
    const requestData = {
      // Incluimos userId como espera el backend
      userId: formData.author,
      
      // También incluimos user para satisfacer la validación
      user: formData.author,
      
      // Incluimos author como está en el modelo
      author: formData.author,
      
      name: formData.name,
      type: formData.type,
      startTime: new Date(formData.startTime),
      endTime: new Date(formData.endTime),
      duration: Number(formData.duration),
      distance: Number(formData.distance),
      elevationGain: Number(formData.elevationGain),
      averageSpeed: Number(formData.averageSpeed),
      caloriesBurned: formData.caloriesBurned ? Number(formData.caloriesBurned) : undefined,
      
      // Aseguramos que route y musicPlaylist sean arrays vacíos para evitar el error de validación
      route: [],
      musicPlaylist: []
    };
    
    console.log('Enviando datos de actividad:', requestData);
    
    this.activityService.createActivity(requestData).subscribe({
      next: (response) => {
        console.log('Actividad creada:', response);
        this.loading = false;
        this.activityCreated.emit(true);
        this.resetForm();
      },
      error: (error) => {
        this.loading = false;
        console.error('Error al crear actividad:', error);
        
        // Mostrar mensaje de error más detallado si está disponible
        if (error.error && error.error.message) {
          this.error = error.error.message;
        } else {
          this.error = error.message || 'Error al crear la actividad';
        }
      }
    });
  }
  
  resetForm(): void {
    this.activityForm.reset({
      type: 'running',
      duration: 0,
      distance: 0,
      elevationGain: 0,
      averageSpeed: 0,
      route: [],
      musicPlaylist: []
    });
  }
  
  cancel(): void {
    this.activityCreated.emit(false);
  }
  
  hasError(controlName: string, errorType: string) {
    return this.activityForm.get(controlName)?.hasError(errorType) && 
           (this.activityForm.get(controlName)?.touched || this.activityForm.get(controlName)?.dirty);
  }
}