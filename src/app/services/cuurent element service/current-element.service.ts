import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CurrentElementService {

  private apiUrl = 'http://localhost:8000/element';

  constructor(private http:HttpClient) { }

  getElement(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  updateElement(data: any): Observable<any> {
    return this.http.put<any>(this.apiUrl, data);
  }

}
