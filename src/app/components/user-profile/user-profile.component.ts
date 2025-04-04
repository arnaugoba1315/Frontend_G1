import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';



@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  user: any = null;
  profileForm: FormGroup;
  loading: boolean = false;
  error: string = '';
  success: string = '';
  editMode: boolean = false;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.profileForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      email: ['', [Validators.required, Validators.email]],
      bio: [''],
      profilePicture: ['']
    });
  }

  ngOnInit(): void {
    this.user = this.authService.currentUser;
    
    // Si no hay usuario autenticado, redirigir al login
    if (!this.user) {
      this.router.navigate(['/login']);
      return;
    }
    
    // Cargar los detalles completos del usuario
    this.loadUserDetails();
  }

  loadUserDetails(): void {
    this.loading = true;
    
    // Usamos el ID del usuario actual para cargar sus detalles completos
    this.userService.getUserById(this.user.id).subscribe({
      next: (userData) => {
        this.user = userData;
        this.loading = false;
        
        // Actualizar el formulario con los datos del usuario
        this.profileForm.patchValue({
          username: userData.username,
          email: userData.email,
          bio: userData.bio || '',
          profilePicture: userData.profilePicture || ''
        });
      },
      error: (error) => {
        this.loading = false;
        this.error = 'Error al cargar los datos del usuario';
        console.error('Error al cargar datos del usuario:', error);
      }
    });
  }

  toggleEditMode(): void {
    this.editMode = !this.editMode;
    
    if (!this.editMode) {
      // Restablecer el formulario si se cancela la edición
      this.profileForm.patchValue({
        username: this.user.username,
        email: this.user.email,
        bio: this.user.bio || '',
        profilePicture: this.user.profilePicture || ''
      });
    }
  }

  hasError(controlName: string, errorType: string): boolean {
    const control = this.profileForm.get(controlName);
    return !!control?.hasError(errorType) && control.touched;
  }

  saveProfile(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';

    const updateData = {
      username: this.profileForm.value.username,
      email: this.profileForm.value.email,
      bio: this.profileForm.value.bio,
      profilePicture: this.profileForm.value.profilePicture
    };

    this.userService.updateUser(this.user._id, updateData).subscribe({
      next: (response) => {
        this.loading = false;
        this.success = 'Perfil actualizado correctamente';
        this.user = response.user;
        this.editMode = false;
        
        // Actualizar el usuario en el servicio de autenticación
        const currentUser = this.authService.currentUser;
        const updatedUser = {
          ...currentUser,
          username: response.user.username,
          email: response.user.email,
          profilePicture: response.user.profilePicture
        };
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      },
      error: (error) => {
        this.loading = false;
        this.error = error.error?.message || 'Error al actualizar el perfil';
        console.error('Error al actualizar el perfil:', error);
      }
    });
  }

  goToHome(): void {
    this.router.navigate(['/home']);
  }

  logout(): void {
    this.authService.logout();
    // La redirección la maneja el servicio de autenticación
  }
}