import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { User } from '../models/user.model';
import { FormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-backoffice',
  imports: [CommonModule, FormsModule],
  templateUrl: './backoffice.component.html',
  styleUrl: './backoffice.component.css',
  standalone: true
})
export class BackOfficeComponent implements OnInit {
  // Variable para controlar la visualización de usuarios
  usuariosListados = false;
  
  // Variables para la lista de usuarios
  users: User[] = [];
  
  // Variables para paginación
  currentPage = 1;
  itemsPerPage = 5; // Limite de 5 usuarios por página
  totalUsers = 0;
  totalPages = 0;
  pages: number[] = [];
  
  constructor(
    private userService: UserService,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    // No cargar usuarios al inicio
  }
  
  // Método para obtener usuarios paginados cuando se hace clic en el botón
  obtenerUsuarios() {
    this.userService.getUsers(this.currentPage, this.itemsPerPage).subscribe({
      next: (data) => {
        this.users = data.users;
        this.totalUsers = data.totalUsers;
        this.totalPages = data.totalPages;
        this.generatePageNumbers();
        this.usuariosListados = true; // Mostrar la lista de usuarios
      },
      error: (error) => {
        console.error('Error al obtener usuarios:', error);
      }
    });
  }
  
  // Generar números de página para la paginación
  generatePageNumbers() {
    this.pages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      this.pages.push(i);
    }
  }
  
  // Cambiar de página
  changePage(page: number) {
    if (page < 1 || page > this.totalPages) {
      return;
    }
    this.currentPage = page;
    this.obtenerUsuarios();
  }
  
  // Para trackBy en ngFor
  trackByUserId(index: number, user: User): number {
    return user.id;
  }
  
  // Ver detalles del usuario al hacer clic
  verDetallesUsuario(user: User) {
    // Aquí puedes navegar a una ruta de detalles o mostrar un modal
    this.router.navigate(['/users', user.id]);
    // Alternativamente, si no tienes una ruta específica, podrías abrir un modal
  }
}