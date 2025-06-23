// reserva.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReservaService {
  private readonly ambientesKey = 'reservasData';
  private readonly misReservasKey = 'misReservas';

  public ambientes$ = new BehaviorSubject<any[]>([]);
  public misReservas$ = new BehaviorSubject<any[]>([]);

  constructor() {
    const savedAmbientes = localStorage.getItem(this.ambientesKey);
    const savedReservas = localStorage.getItem(this.misReservasKey);

    if (savedAmbientes) {
      try {
        const data = JSON.parse(savedAmbientes);
        if (data.ambientes) this.ambientes$.next(data.ambientes);
      } catch (e) {
        console.warn('Error al leer ambientes:', e);
      }
    }

    if (savedReservas) {
      try {
        const data = JSON.parse(savedReservas);
        if (data.reservas) this.misReservas$.next(data.reservas);
      } catch (e) {
        console.warn('Error al leer reservas:', e);
      }
    }
  }

  guardarReservas(reservas: any[]) {
    this.misReservas$.next(reservas);
    localStorage.setItem(this.misReservasKey, JSON.stringify({ reservas }));
  }

  guardarAmbientes(ambientes: any[]) {
    this.ambientes$.next(ambientes);
    localStorage.setItem(this.ambientesKey, JSON.stringify({ ambientes }));
  }

  agregarReserva(reserva: any) {
    const actuales = this.misReservas$.getValue();
    const actualizadas = [...actuales, reserva];
    this.guardarReservas(actualizadas);
  }

  eliminarReserva(index: number) {
    const actuales = this.misReservas$.getValue();
    actuales.splice(index, 1);
    this.guardarReservas([...actuales]);
  }
}
