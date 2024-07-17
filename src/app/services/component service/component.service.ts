import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { IComponent } from '../../utils/interface/tab.interface';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class ComponentService {
  private apiUrl = 'http://localhost:8000/components';

  constructor(private http: HttpClient) {}

  getComponents(): Observable<IComponent[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  addComponent(component: IComponent): Observable<IComponent> {
    component.id = uuidv4();
    return this.http.post<IComponent>(this.apiUrl, component).pipe(
      catchError((error) => {
        throw error;
      })
    );
  }
  updateComponent(component: IComponent): Observable<IComponent> {
    const url = `${this.apiUrl}/${component.id}`;
    return this.http.put<IComponent>(url, component).pipe(
      catchError((error) => {
        console.error('Error updating component:', error);
        return throwError(error);
      })
    );
  }
  
  // deleteComponent(id: string): Observable<void> {
  //   const url = `${this.apiUrl}/${id}`;
  //   return this.http.delete<void>(url).pipe(
  //     catchError((error) => {
  //       console.error('Error deleting component:', error);
  //       return throwError(error);
  //     })
  //   );
  // }

  deleteComponent(id: string): Observable<any> {
    const url = `http://localhost:3000/components/${id}`; // Replace with your JSON Server URL
    return this.http.delete<any>(url);
  }
}
