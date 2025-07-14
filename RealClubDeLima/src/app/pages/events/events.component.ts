import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Evento {
  id: number;
  nombre: string;
  tematica: string;
  fecha: string;     // ISO yyyy-MM-dd
}

/* URL del endpoint API Gateway */
const API_EVENTS = 'https://9ceoxvw7mb.execute-api.us-east-1.amazonaws.com/realClubLima/events';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {

  events: Evento[] = [];
  cargando = true;
  errorMsg = '';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.cargarEventos();
  }

  private cargarEventos(): void {
    this.http.get<{ statusCode: number; body: string }>(API_EVENTS)
      .subscribe({
        next: resp => {
          /* La Lambda devuelve body como string → JSON.parse */
          this.events = JSON.parse(resp.body) as Evento[];
          this.cargando = false;
        },
        error: err => {
          console.error(err);
          this.errorMsg = 'No se pudieron cargar los eventos.';
          this.cargando = false;
        }
      });
  }

  /* Utilizado por *ngFor para mejorar rendimiento */
  trackById = (_: number, ev: Evento) => ev.id;

  registrar(ev: Evento): void {
    console.log('Registrarse en:', ev);
    /* Aquí pondrás tu lógica real de inscripción */
  }

  enviarSugerencia(): void {
    console.log('Sugerencia enviada');
  }
}
