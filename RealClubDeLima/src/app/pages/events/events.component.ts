import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Evento {
  id: number;
  nombre: string;
  tematica: string;
  fecha: string;    // ISO (YYYY-MM-DD)
}

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {

  events: Evento[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<Evento[]>('assets/data/events.json')
      .subscribe({
        next: data => this.events = data,
        error: err => console.error('No se pudo cargar events.json', err)
      });
  }

  trackById = (_: number, ev: Evento) => ev.id;

  registrar(ev: Evento): void {
    console.log('Registrarse en:', ev);
    // Aquí irá tu lógica real en el futuro
  }

  enviarSugerencia(): void {
    console.log('Sugerencia enviada');
    // Procesar o enviar al backend
  }
}
