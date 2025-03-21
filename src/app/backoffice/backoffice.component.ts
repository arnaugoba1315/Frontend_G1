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
  itemsPerPage = 5;
  totalPages = 0;
  totalUsers = 0;
  pages: number[] = [];
  loading = false;
  error = '';
  usuariosListados = false;
  showCreateModal = false;
  showEditModal = false;
  showViewModal = false;
  selectedUser: User | null = null;
  
  // Datos de ejemplo para simulación
  allMockUsers: User[] = [
    { _id: '1', username: 'Usuario1', email: 'usuario1@example.com', level: 1, bio: 'Bio de usuario 1', profilePicture: '', visible: true, visibility: true },
    { _id: '2', username: 'Usuario2', email: 'usuario2@example.com', level: 2, bio: 'Bio de usuario 2', profilePicture: '', visible: true, visibility: true },
    { _id: '3', username: 'Usuario3', email: 'usuario3@example.com', level: 3, bio: 'Bio de usuario 3', profilePicture: '', visible: false, visibility: false },
    { _id: '4', username: 'Usuario4', email: 'usuario4@example.com', level: 1, bio: 'Bio de usuario 4', profilePicture: '', visible: true, visibility: true },
    { _id: '5', username: 'Usuario5', email: 'usuario5@example.com', level: 2, bio: 'Bio de usuario 5', profilePicture: '', visible: false, visibility: false },
    { _id: '6', username: 'Usuario6', email: 'usuario6@example.com', level: 3, bio: 'Bio de usuario 6', profilePicture: '', visible: true, visibility: true },
  ];
  
  constructor(
    private userService: UserService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    // Para cargar automáticamente los usuarios al iniciar la aplicación, descomenta la siguiente línea:
    // this.obtenerUsuarios();
  }

  obtenerUsuarios(): void {
    this.loading = true;
    
    // Obtenir tots els usuaris, incloent els ocults
    this.userService.getUsers(this.currentPage, this.itemsPerPage, true)
      .subscribe({
        next: (response) => {
          console.log('Respuesta del servidor:', response); // Log para depuración
          console.log('Usuarios recibidos:', response.users);
          
          if (response.users && response.users.length > 0) {
            this.users = response.users.map((user: User) => ({
              ...user,
              // Utilitzar qualsevol de les dues propietats, prioritzant visibility (del backend)
              visible: user.visibility !== undefined ? user.visibility : (user.visible !== undefined ? user.visible : true)
            }));
            console.log('Usuarios procesados:', this.users); // Log para depuración
            this.totalUsers = response.totalUsers;
            this.totalPages = response.totalPages;
          } else {
            console.log('No se encontraron usuarios, usando datos de simulación'); // Log para depuración
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
    this.users = this.allMockUsers.slice(startIndex, endIndex).map(user => ({
      ...user,
      visible: user.visibility !== undefined ? user.visibility : (user.visible !== undefined ? user.visible : true)
    }));
    
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
    this.showEditModal = false;
    this.showViewModal = false;
    this.selectedUser = null;
  }

  editarUsuario(user: User): void {
    console.log('Editar usuario:', user);
    this.selectedUser = { ...user }; // Crear una copia para no modificar el original directamente
    this.showEditModal = true;
    this.showCreateModal = false;
    this.showViewModal = false;
  }

  marcarUsuarioInvisible(user: User): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: `¿Estás seguro de que deseas ${user.visible ? 'ocultar' : 'mostrar'} el usuario ${user.username}?` }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        
        // Llamamos a nuestro servicio para cambiar la visibilidad en el backend
        this.userService.toggleUserVisibility(user._id).subscribe({
          next: (response) => {
            console.log(`Usuario ${user._id} ${response.user.visibility ? 'visible' : 'ocultado'}`);
            // Actualizamos ambas propiedades para mantener consistencia
            user.visible = response.user.visibility;
            user.visibility = response.user.visibility;
            this.loading = false;
          },
          error: (error) => {
            console.error('Error al cambiar visibilidad del usuario:', error);
            this.error = 'Error al cambiar la visibilidad del usuario';
            this.loading = false;
          }
        });
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
            
            this.obtenerUsuarios(); // Recargar la lista después de eliminar
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
    this.selectedUser = { ...user }; // Crear una copia para no modificar el original
    this.showViewModal = true;
    this.showEditModal = false;
    this.showCreateModal = false;
  }

  onUserCreated(success: boolean): void {
    this.showCreateModal = false;
    if (success) {
      this.obtenerUsuarios(); // Recargar la lista después de crear un nuevo usuario
    }
  }

  onUserEdited(success: boolean): void {
    if (success && this.selectedUser) {
      // Actualizar el usuario en el backend
      this.userService.updateUser(this.selectedUser._id, this.selectedUser).subscribe({
        next: () => {
          console.log(`Usuario ${this.selectedUser?._id} actualizado correctamente`);
          this.showEditModal = false;
          this.obtenerUsuarios(); // Recargar la lista
        },
        error: (error) => {
          console.error('Error al actualizar usuario:', error);
        }
      });
    } else {
      this.showEditModal = false;
    }
  }

  closeViewModal(): void {
    this.showViewModal = false;
    this.selectedUser = null;
  }

  trackByUserId(index: number, user: User): string {
    return user._id;
  }
}