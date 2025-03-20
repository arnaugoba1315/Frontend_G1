import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.css']
})
export class UserCreateComponent implements OnInit {
  userForm: FormGroup;
  submitted = false;
  loading = false;
  error = '';

  @Output() userCreated = new EventEmitter<boolean>();

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService
  ) {
    this.userForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      bio: [''],
      profilePicture: [''],
      level: [1, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    // Inicialización adicional si es necesaria
  }

  // Getter para facilitar el acceso a los campos del formulario
  get f() { 
    return this.userForm.controls; 
  }

  // Verificar si un campo tiene error
  hasError(controlName: string, errorType: string) {
    return this.userForm.get(controlName)?.hasError(errorType) && 
           (this.userForm.get(controlName)?.touched || this.submitted);
  }

  onSubmit() {
    this.submitted = true;

    // Detener si el formulario no es válido
    if (this.userForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = '';

    this.userService.createUser(this.userForm.value).subscribe({
      next: () => {
        this.loading = false;
        this.userCreated.emit(true);
        this.resetForm();
      },
      error: (error) => {
        this.loading = false;
        this.error = error.message || 'Error al crear usuario. Por favor, inténtalo de nuevo.';
        console.error('Error al crear usuario:', error);
      }
    });
  }

  // Restablecer el formulario
  resetForm() {
    this.submitted = false;
    this.userForm.reset({
      level: 1
    });
  }

  // Cancelar la creación
  cancel() {
    this.userCreated.emit(false);
  }
}