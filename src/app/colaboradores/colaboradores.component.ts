// colaboradores.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirmDialog/confirm-dialog.component';

@Component({
  selector: 'app-colaboradores',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './colaboradores.component.html',
  styleUrls: ['./colaboradores.component.css']
})
export class ColaboradoresComponent implements OnInit {
  // Lista de usuarios
  users: User[] = [];
  
  // Paginación
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  totalPages = 0;
  pages: number[] = [];

  constructor(
    private userService: UserService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.obtenerUsuarios();
  }

  // Obtener usuarios con paginación
  obtenerUsuarios(): void {
    this.userService.getUsers(this.currentPage, this.itemsPerPage).subscribe({
      next: (data) => {
        this.users = data.users;
        this.totalItems = data.totalUsers;
        this.totalPages = data.totalPages;
        this.generatePages();
      },
      error: (error) => {
        console.error('Error al obtener usuarios:', error);
      }
    });
  }

  // Generar números de página
  generatePages(): void {
    this.pages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      this.pages.push(i);
    }
  }

  // Cambiar página
  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) {
      return;
    }
    this.currentPage = page;
    this.obtenerUsuarios();
  }

  // Cambiar registros por página
  cambiarRegistrosPorPagina(): void {
    this.currentPage = 1; // Volver a primera página
    this.obtenerUsuarios();
  }

  // Editar usuario
  editUser(user: User): void {
    console.log('Editar usuario:', user);
    // Implementar navegación a página de edición
  }

  // Eliminar usuario
  deleteUser(index: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);
    
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed && this.users[index]) {
        const userId = this.users[index].id;
        
        // Si el backend está implementado para eliminar
        this.userService.deleteUser(userId).subscribe({
          next: () => {
            this.users.splice(index, 1);
            // Refrescar la lista si es necesario
            this.obtenerUsuarios();
          },
          error: (error: any) => {
            console.error('Error al eliminar usuario:', error);
          }
        });
      }
    });
  }

  // Para optimizar rendimiento con ngFor
  trackByUserId(index: number, user: User): number {
    return user.id;
  }
}