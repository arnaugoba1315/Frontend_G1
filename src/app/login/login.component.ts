import { CommonModule } from '@angular/common';
import { Component, inject, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  standalone: true
})
export class LoginComponent implements OnInit {
  formLogin: FormGroup;
  authService = inject(AuthService);
  @Output() loggedin = new EventEmitter<string>();
  @Output() exportLoggedIn = new EventEmitter<boolean>();

  constructor(private form: FormBuilder){
    this.formLogin = this.form.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]], 
    });
  }
ngOnInit(): void {
    this.formLogin = this.form.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }
  hasError(controlName:string, errorType:string){
    return this.formLogin.get(controlName)?.hasError(errorType) && this.formLogin.get(controlName)?.touched;  
  }

  login(){
    if (this.formLogin.invalid) {
      this.formLogin.markAllAsTouched();
      return;
    }

    const loginData = this.formLogin.value;

    this.authService.login(loginData).subscribe({
      next: (response) => {
        console.log('Inici de sessió satisfactori:', response);
        this.exportLoggedIn.emit(true);
      
      },
      error: (error) => {
        console.error("Error en l'inici de sessió:", error);
        alert("Error en l'inici de sessió, comprova les teves credencials.");
      }
    });
  }
}