import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { Todo } from '../../models/todo';
import { TodoService } from '../../services/todo-service.service';

@Component({
  selector: 'app-create-element',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './create-element.component.html',
  styleUrls: ['./create-element.component.css']
})
export class CreateElementComponent implements OnInit {

  _todoId?: string;
  _form = new FormGroup({
    userId: new FormControl('', Validators.required),
    id: new FormControl('', Validators.required),
    title: new FormControl('', Validators.required),
    completed: new FormControl(false)
  });

  constructor(
    private _route: ActivatedRoute, // Para optener el parametro de la URL
    private _todoService: TodoService
  ) { }

  ngOnInit() {
    this._todoId = this._todoId || this._route.snapshot.paramMap.get('id') || undefined;
    if (this._todoId) {
      this._todoService.getTodo(this._todoId)
        .subscribe(todo => {
          if (todo) {
            this._form.setValue({
              userId: todo.userId,
              id: todo.id,
              title: todo.title,
              completed: todo.completed
          });
        }
      });
    }
  }


  onSubmit() {
    if (this._form.valid) {
      console.log(this._form.value as Todo);
      this.onCreate(this._form.value as Todo);
      this._form.reset();  
    }
  }

  onCreate(todo: Todo ) {
    console.log("onCreate " + todo);
    this._todoService.createTodo(todo)
      .subscribe({
        next: data => {
          console.log(data);
        },
        error: error => {
          console.log(error);
        }
      })
  }
}
