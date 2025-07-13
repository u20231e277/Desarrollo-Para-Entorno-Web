import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SesionService {
  private sesionSubject = new BehaviorSubject<boolean>(this.checkSesion());
  sesion$ = this.sesionSubject.asObservable();

  private checkSesion(): boolean {
    return !!localStorage.getItem('usuario');
  }

  iniciarSesion(usuario: any) {
    localStorage.setItem('usuario', JSON.stringify(usuario));
    this.sesionSubject.next(true);
  }

  cerrarSesion() {
    localStorage.removeItem('usuario');
    this.sesionSubject.next(false);
  }
}
