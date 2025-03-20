import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { User } from '../models/user.model';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirmDialog/confirm-dialog.component';
import { UserCreateComponent } from '../components/user-create/user-create.component';
import { UserEditComponent } from '../components/user-edit/user-edit.component';

@Component({
  selector: 'app-backoffice',
  imports: [CommonModule, FormsModule, UserCreateComponent,ReactiveFormsModule, UserEditComponent],
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

  // Variable para controlar el formulario de creación
  showCreateModal = false;
  
  constructor(
    private userService: UserService,
    private router: Router,
    private dialog: MatDialog
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
        alert('Error al cargar los usuarios. Por favor, inténtalo de nuevo.');
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
    // Mostrar los detalles del usuario en una alerta o modal temporal
    // hasta que implementes una vista de detalles completa
    const detalles = `
      Usuario: ${user.username}
      Email: ${user.email}
      Nivel: ${user.level}
      Bio: ${user.bio || 'No disponible'}
    `;
    
    alert(detalles);
    
    // Si tienes una ruta específica para ver detalles, descomenta esta línea:
    // this.router.navigate(['/users', user.id]);
  }

  // Editar usuario
  editarUsuario(user: User) {
    const dialogRef = this.dialog.open(UserEditComponent, { 
      width: '400px',
      data: user
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Usuario editado con éxito',result);
        this.obtenerUsuarios();
      }
    });
    /* try {
      // Comprobamos si la ruta existe
      this.router.navigate(['/users/edit', user.id]);
    } catch (error) {
      console.error('Error al navegar a la página de edición:', error);
      alert('La funcionalidad de edición de usuarios está en desarrollo.');
    }*/
  }

  marcarUsuarioInvisible(user: User) {
  // Verificar que tenemos el ID del usuario
  if (!user || !user.id) {
    console.error('ID de usuario no válido');
    alert('Error: No se pudo identificar el usuario');
    return;
  }

  const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    width: '300px',
    data: { 
      title: 'Ocultar Usuario',
      message: `¿Estás seguro de que deseas ocultar al usuario ${user.username}?` 
    }
  });
  
  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      // Enviamos el ID y el estado visible:false
      const userData = { 
        id: user.id,
        visible: false 
      };
      
      this.userService.updateUser(user.id, userData).subscribe({
        next: () => {
          console.log(`Usuario ${user.id} ocultado correctamente`);
          alert('Usuario ocultado correctamente');
          this.obtenerUsuarios();
        },
        error: (error) => {
          console.error(`Error al ocultar usuario ${user.id}:`, error);
          alert('Error al ocultar el usuario');
        }
      });
    }
  });
}
  // Eliminar usuario (soft delete mediante API deleteUser)
  eliminarUsuario(user: User) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: { 
        title: 'Confirmar eliminación', 
        message: '¿Estás seguro de que deseas eliminar este usuario? Esta acción lo ocultará del sistema.' 
      }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.deleteUser(user.id).subscribe({
          next: (response) => {
            console.log('Usuario eliminado con éxito:', response);
            // Actualizar la lista de usuarios
            this.obtenerUsuarios();
            // Mostrar mensaje de éxito
            alert('Usuario eliminado con éxito');
          },
          error: (error) => {
            console.error('Error al eliminar el usuario:', error);
            alert('Error al eliminar el usuario. Por favor, inténtalo de nuevo.');
          }
        });
      }
    });
  }

  // Mostrar formulario de creación de usuario
  showCreateUserForm() {
    this.showCreateModal = true;
  }

  // Manejar la creación exitosa de un usuario
  onUserCreated(success: boolean) {
    if (success) {
      this.showCreateModal = false;
      // Recargar la lista de usuarios si ya estaba visible
      if (this.usuariosListados) {
        this.obtenerUsuarios();
      }
    } else {
      // Si el usuario canceló, solo cerrar el formulario
      this.showCreateModal = false;
    }
  }
}