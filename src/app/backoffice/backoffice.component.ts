import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { UserCreateComponent } from '../components/user-create/user-create.component';
import { User } from '../models/user.model';

@Component({
  selector: 'app-backoffice',
  templateUrl: './backoffice.component.html',
  styleUrls: ['./backoffice.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, UserCreateComponent]
})
export class BackOfficeComponent implements OnInit {
  users: User[] = [];
  currentPage = 1;
  itemsPerPage = 5; // Limitamos a 5 usuarios por página
  totalPages = 0;
  totalUsers = 0;
  pages: number[] = [];
  loading = false;
  error = '';
  usuariosListados = false;
  showCreateModal = false;
  
  // Datos de ejemplo completos (para simulación)
  allMockUsers: User[] = [
    { _id: '1', username: 'Usuario1', email: 'usuario1@example.com', level: 1, bio: 'Bio de usuario 1', profilePicture: '' },
    { _id: '2', username: 'Usuario2', email: 'usuario2@example.com', level: 2, bio: 'Bio de usuario 2', profilePicture: '' },
    { _id: '3', username: 'Usuario3', email: 'usuario3@example.com', level: 3, bio: 'Bio de usuario 3', profilePicture: '' },
    { _id: '4', username: 'Usuario4', email: 'usuario4@example.com', level: 1, bio: 'Bio de usuario 4', profilePicture: '' },
    { _id: '5', username: 'Usuario5', email: 'usuario5@example.com', level: 2, bio: 'Bio de usuario 5', profilePicture: '' },
    { _id: '6', username: 'Usuario6', email: 'usuario6@example.com', level: 3, bio: 'Bio de usuario 6', profilePicture: '' },
    { _id: '7', username: 'Usuario7', email: 'usuario7@example.com', level: 1, bio: 'Bio de usuario 7', profilePicture: '' },
    { _id: '8', username: 'Usuario8', email: 'usuario8@example.com', level: 2, bio: 'Bio de usuario 8', profilePicture: '' },
    { _id: '9', username: 'Usuario9', email: 'usuario9@example.com', level: 3, bio: 'Bio de usuario 9', profilePicture: '' },
    { _id: '10', username: 'Usuario10', email: 'usuario10@example.com', level: 1, bio: 'Bio de usuario 10', profilePicture: '' },
    { _id: '11', username: 'Usuario11', email: 'usuario11@example.com', level: 2, bio: 'Bio de usuario 11', profilePicture: '' },
    { _id: '12', username: 'Usuario12', email: 'usuario12@example.com', level: 3, bio: 'Bio de usuario 12', profilePicture: '' }
  ];
  
  constructor(
    private userService: UserService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    // No cargamos usuarios automáticamente, esperamos a que el usuario haga clic en el botón
  }

  obtenerUsuarios(): void {
    this.loading = true;
    
    // En un entorno real, llamarías al servicio con los parámetros de paginación:
    this.userService.getUsers(this.currentPage, this.itemsPerPage)
      .subscribe({
        next: (response) => {
          if (response.users && response.users.length > 0) {
            this.users = response.users;
            this.totalUsers = response.totalUsers;
            this.totalPages = response.totalPages;
          } else {
            // Simulación de paginación con datos de prueba
            this.simularPaginacion();
          }
          this.generatePageNumbers();
          this.loading = false;
          this.usuariosListados = true;
        },
        error: (err) => {
          console.error('Error al cargar usuarios:', err);
          this.error = 'Error al cargar usuarios';
          this.loading = false;
          
          // En caso de error, simulamos paginación con datos de prueba
          this.simularPaginacion();
          this.generatePageNumbers();
          this.usuariosListados = true;
        }
      });
  }

  // Método para simular la paginación con datos de prueba
  simularPaginacion(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = Math.min(startIndex + this.itemsPerPage, this.allMockUsers.length);
    
    // Obtener los usuarios de la página actual
    this.users = this.allMockUsers.slice(startIndex, endIndex);
    
    // Calcular el total de usuarios y páginas
    this.totalUsers = this.allMockUsers.length;
    this.totalPages = Math.ceil(this.totalUsers / this.itemsPerPage);
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
    this.obtenerUsuarios();
  }

  showCreateUserForm(): void {
    this.showCreateModal = true;
  }

  editarUsuario(user: User): void {
    console.log('Editar usuario:', user);
    // Aquí implementarías la lógica para editar un usuario
  }

  marcarUsuarioInvisible(user: User): void {
    console.log('Ocultar usuario:', user);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: `¿Estás seguro de que deseas ocultar el usuario ${user.username}?` }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Lógica para ocultar usuario
        console.log(`Usuario ${user._id} ocultado`);
        this.obtenerUsuarios();
      }
    });
  }

  eliminarUsuario(user: User): void {
    console.log('Eliminar usuario:', user);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: `¿Estás seguro de que deseas eliminar el usuario ${user.username}?` }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.deleteUser(user._id).subscribe({
          next: () => {
            console.log(`Usuario ${user._id} eliminado`);
            
            // Eliminar el usuario de nuestros datos de prueba también
            const index = this.allMockUsers.findIndex(u => u._id === user._id);
            if (index !== -1) {
              this.allMockUsers.splice(index, 1);
            }
            
            this.obtenerUsuarios();
          },
          error: (error) => {
            console.error('Error al eliminar usuario:', error);
          }
        });
      }
    });
  }

  verDetallesUsuario(user: User): void {
    console.log('Ver detalles de usuario:', user);
    // Lógica para mostrar detalles
  }

  onUserCreated(success: boolean): void {
    this.showCreateModal = false;
    if (success) {
      this.obtenerUsuarios();
    }
  }

  trackByUserId(index: number, user: User): string {
    return user._id;
  }
}