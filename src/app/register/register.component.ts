import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true
})
export class RegisterComponent {
  user = {
    name: '',
    email: '',
    password: ''
  };

  constructor() {}

  onSubmit() {
    console.log('Usuario registrado:', this.user);
    // Aquí puedes agregar la lógica para enviar los datos a una API
  }
}