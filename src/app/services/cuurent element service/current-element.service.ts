import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IElement } from '../../utils/interface/tab.interface';

@Injectable({
  providedIn: 'root',
})
export class CurrentElementService {
  private currentElementSubject = new BehaviorSubject<any>(null);
  currentElement$ = this.currentElementSubject.asObservable();

  private apiUrl = 'http://localhost:8000/elements';

  constructor(private http: HttpClient) {}

  getElement(): Observable<IElement> {
    return this.http.get<IElement>(this.apiUrl);
  }

  updateElement(data: IElement): Observable<IElement> {
    return this.http.put<IElement>(this.apiUrl, data);
  }

  setCurrentElement(element: any): void {
    this.currentElementSubject.next(element);
  }
}
