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
      route: [[]],
      musicPlaylist: [[]]
    });
  }
  
  ngOnInit(): void {
    this.loadUsers();
  }
  
  loadUsers(): void {
    this.loading = true;
    
    this.userService.getUsers(1, 100, true) // Obtenir fins a 100 usuaris, inclosos els ocults
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
      return;
    }
    
    this.loading = true;
    this.error = '';
    
    const formData = this.activityForm.value;
    
    // Format correcte de les dades
    if (typeof formData.startTime === 'string') {
      formData.startTime = new Date(formData.startTime);
    }
    if (typeof formData.endTime === 'string') {
      formData.endTime = new Date(formData.endTime);
    }
    
    // Per calcular la duració de l'activitat si no es fa manualment (en minuts)
    if (!formData.duration || formData.duration === 0) {
      const startTime = new Date(formData.startTime);
      const endTime = new Date(formData.endTime);
      formData.duration = Math.round((endTime.getTime() - startTime.getTime()) / 60000);
    }
    
    // Assegurar que els arrays estiguin inicialitzats
    if (!formData.route) formData.route = [];
    if (!formData.musicPlaylist) formData.musicPlaylist = [];
    
    console.log('Enviando datos de actividad:', formData);
    
    this.activityService.createActivity(formData).subscribe({
      next: (response) => {
        console.log('Actividad creada:', response);
        this.loading = false;
        this.activityCreated.emit(true);
        this.resetForm();
      },
      error: (error) => {
        this.loading = false;
        this.error = error.message || 'Error al crear la actividad';
        console.error('Error al crear actividad:', error);
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
  
  // Un altre mètode per obtenir errors dels camps del formulari
  get f() { 
    return this.activityForm.controls; 
  }
  
  hasError(controlName: string, errorType: string) {
    return this.activityForm.get(controlName)?.hasError(errorType) && 
           (this.activityForm.get(controlName)?.touched || this.activityForm.get(controlName)?.dirty);
  }
}