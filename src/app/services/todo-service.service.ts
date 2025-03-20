import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Todo } from '../models/todo';

@Injectable({
  providedIn: 'root'
})

export class TodoService {
  private _url = 'https://jsonplaceholder.typicode.com/todos';
  
  constructor( private _http: HttpClient ) { }

  getTodos(): Observable<Todo[]> {
    return this._http.get<Todo[]>(this._url );
  }

  getTodo(id: string): Observable<Todo> {
    return this._http.get<Todo>(this._url + '/' + id);
  } 

  deleteTodo(id: string): Observable<Todo> {
    return this._http.delete<Todo>(this._url + '/' + id);
  } 

  createTodo(todo: Todo): Observable<Todo> {
    const fakeTodo = new Todo("fakeUser", "fakeId", "Fake Todo", false);
    return of(fakeTodo);
    //return this._http.post<Todo>(this._url, todo);
  }
}
