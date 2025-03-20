import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { User } from '../models/user.model';
import { ColaboradoresComponent } from "../colaboradores/colaboradores.component";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-backoffice',
  imports: [CommonModule, ColaboradoresComponent, FormsModule],
  templateUrl: './backoffice.component.html',
  styleUrl: './backoffice.component.css',
  standalone: true
})
export class BackOfficeComponent {

  foto: string;
  mostrardata: boolean;
  
  usuario: User = {
    id: 1,
    name: "Toni",
    age: 40,
    email: "toni.oller@gmail.com",
  };
  
  constructor() {      
    this.foto = "https://github.com/tonioller.png";
    this.mostrardata = false;
  }

  mostrardatos(){
    this.mostrardata = true;
  }

  getName(Name: string){
    this.usuario.name = Name;
  }

}
