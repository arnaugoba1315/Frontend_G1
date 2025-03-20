import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { Todo } from '../../models/todo';
import { TodoService } from '../../services/todo-service.service';

@Component({
  selector: 'app-element',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './element.component.html',
  styleUrls: ['./element.component.css']
})

export class ElementComponent {

  _todo: Todo = new Todo();
  private _id: string = "";

  constructor(
    private _route: ActivatedRoute, // Para optener el parametro de la URL
    private _todoService: TodoService
  ) { }

  ngOnInit(): void {
    // Obtener el parámetro de la URL
    this._id = this._route.snapshot.paramMap.get('id') || "";
    console.log("ElementComponent " + this._id);
    this.getTodo(this._id);
  }

    // Getting todo
    getTodo(id: string) { 
      this._todoService.getTodo(id)
        .subscribe({
          next: data => {
            console.log(data);
            this._todo = data;
          }
        })
    } 
}
