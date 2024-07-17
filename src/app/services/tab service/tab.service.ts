import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { Tab } from '../../utils/interface/tab.interface';

@Injectable({
  providedIn: 'root',
})
export class TabService {
  private apiUrl = 'http://localhost:8000/tabs';

  constructor(private http: HttpClient) {}

  getTabs(): Observable<Tab[]> {
    return this.http.get<Tab[]>(this.apiUrl);
  }

  addTab(tab: Tab): Observable<Tab> {
    tab.id = uuidv4(); // Generate uuid
    tab.added_components = tab.added_components.map(comp => ({
      ...comp,
      id: uuidv4(), // Generate UUID for each added component
    }));
    return this.http.post<Tab>(this.apiUrl, tab);
  }

  removeTab(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updateTab(tab: Tab): Observable<Tab> {
    return this.http.put<Tab>(`${this.apiUrl}/${tab.id}`, tab);
  }

  getTabById(id: string): Observable<Tab> {
    return this.http.get<Tab>(`${this.apiUrl}/${id}`);
  }
  
}
