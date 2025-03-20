import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { Todo } from '../../models/todo';
import { TodoService } from '../../services/todo-service.service';

@Component({
  selector: 'app-colletion',
  standalone: true,
  imports: [CommonModule , ReactiveFormsModule],
  templateUrl: './colletion.component.html',
  styleUrls: ['./colletion.component.css']
})

export class CollectionComponent {
  _form = new FormGroup({
    title: new FormControl('')
  });
  _filteredTodos : Todo[] = []; // filtered
  _downloadedTodos : Todo[] = []; // downloaded
  _message: string = "";

  constructor(
    private _router: Router,
    private _todoService: TodoService
  ) { }

  ngOnInit(): void {
    this.getTodosList();
  }

  onSubmit() {
    console.log(this._form.value);
    const title = this._form.get('title')?.value;
    if (title == null || title == "") {
      this._message = "Please enter a title";
      return;
    } 

    this._filteredTodos = this.filterItems(this._downloadedTodos, title);
  }

  // Getting todos list
  getTodosList() {
  this._todoService.getTodos()
    .subscribe({
      next: data => {
        console.log(data);
        this._downloadedTodos = data;
        this._filteredTodos = this._downloadedTodos;
      }, 
      error: error => {
        console.log(error);
      }
    })
  }
  
  //Filter array items based on search criteria (query)
  filterItems(arr : Todo[], query : string) {
    return arr.filter(function(item) {
      return item.title.toLowerCase().indexOf(query.toLowerCase()) !== -1
    })
  }

  onView(id: string) {
    console.log("onView " + id);
    this._router.navigate(['/elements/' + id]);
  }

  onEdit(todo: Todo) {
    console.log("onEdit " + todo);
    this._router.navigate(['/elements/new', todo.id]);
  }

  onDelete(id: string ) {
    console.log("onDelete " + id);
    this._todoService.deleteTodo(id)
      .subscribe({
        next: data => {
          console.log(data);
          this.getTodosList();
        },
        error: error => {
          console.log(error);
        }
      })
    this._router.navigate(['/elements']);
  }

}
