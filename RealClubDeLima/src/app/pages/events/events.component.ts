import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Evento {
  id: number;
  nombre: string;
  tematica: string;
  fecha: string;
}

const API_EVENTS = 'https://9ceoxvw7mb.execute-api.us-east-1.amazonaws.com/realClubLima/events';
const LS_KEY     = 'eventosRegistrados';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {

  events: Evento[] = [];
  cargando = true;
  errorMsg = '';

  /* NUEVO */
  successMsg = '';
  suggestionMsg = '';
  private registrados = new Set<number>();

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Carga ids ya registrados desde localStorage
    const ids = JSON.parse(localStorage.getItem(LS_KEY) || '[]');
    this.registrados = new Set<number>(ids);

    this.cargarEventos();
  }

  private cargarEventos(): void {
    this.http
      .get<{ statusCode: number; body: string }>(API_EVENTS)
      .subscribe({
        next: resp => {
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

  /* ---------- REGISTRO DE EVENTO ---------- */
  registrar(ev: Evento): void {
    if (this.registrados.has(ev.id)) return;      // doble clic

    this.registrados.add(ev.id);
    localStorage.setItem(LS_KEY,
      JSON.stringify([...this.registrados]));

    this.successMsg = `¡Te registraste correctamente en “${ev.nombre}”!`;

    // Oculta mensaje después de 3 s
    setTimeout(() => (this.successMsg = ''), 3000);
  }

  yaRegistrado(id: number): boolean {
    return this.registrados.has(id);
  }

  /* ---------- SUGERENCIAS ---------- */
  enviarSugerencia(form: any): void {
    if (form.invalid) return;

    // Aquí podrías POSTear la sugerencia al backend
    console.log('Sugerencia:', form.value);

    this.suggestionMsg = '¡Sugerencia enviada correctamente!';
    setTimeout(() => (this.suggestionMsg = ''), 3000);

    form.resetForm();
  }

  trackById = (_: number, ev: Evento) => ev.id;
}
