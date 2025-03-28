import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { UserCreateComponent } from '../components/user-create/user-create.component';
import { User } from '../models/user.model';
import { ActivitiesComponent } from '../backoffice-activity/backoffice-activity.component';

@Component({
  selector: 'app-backoffice',
  templateUrl: './backoffice.component.html',
  styleUrls: ['./backoffice.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, UserCreateComponent, ActivitiesComponent]
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
  activeTab: string = 'users';
  
  // Datos de ejemplo completos
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
    // No cargamos usuarios automáticamente
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  obtenerUsuarios(): void {
    this.loading = true;
    
    this.userService.getUsers(this.currentPage, this.itemsPerPage)
      .subscribe({
        next: (response) => {
          if (response.users && response.users.length > 0) {
            this.users = response.users;
            this.totalUsers = response.totalUsers;
            this.totalPages = response.totalPages;
          } else {
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
          
          this.simularPaginacion();
          this.generatePageNumbers();
          this.usuariosListados = true;
        }
      });
  }

  simularPaginacion(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = Math.min(startIndex + this.itemsPerPage, this.allMockUsers.length);
    
    this.users = this.allMockUsers.slice(startIndex, endIndex);
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
    this.selectedUser = null;
    this.showCreateModal = true;
    this.showEditModal = false;
    this.showViewModal = false;
  }

  editarUsuario(user: User): void {
    console.log('Editar usuario:', user);
    this.selectedUser = user;
    this.showEditModal = true;
    this.showCreateModal = false;
    this.showViewModal = false;
  }

  marcarUsuarioInvisible(user: User): void {
    console.log('Ocultar usuario:', user);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: `¿Estás seguro de que deseas ocultar el usuario ${user.username}?` }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
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
    this.selectedUser = user;
    this.showViewModal = true;
    this.showEditModal = false;
    this.showCreateModal = false;
  }

  onUserCreated(success: boolean): void {
    this.showCreateModal = false;
    if (success) {
      this.obtenerUsuarios();
    }
  }

  onUserEdited(success: boolean): void {
    this.showEditModal = false;
    if (success) {
      this.obtenerUsuarios();
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