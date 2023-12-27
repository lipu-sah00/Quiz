// page-visibility.service.ts
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PageVisibilityService {
  private visibilitySubject = new Subject<boolean>();

  getVisibility(): Observable<boolean> {
    return this.visibilitySubject.asObservable();
  }

  constructor() {
    document.addEventListener('visibilitychange', () => {
      this.visibilitySubject.next(document.hidden);
    });
  }
}
