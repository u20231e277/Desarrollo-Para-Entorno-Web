import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reserva',
  templateUrl: './reserva.component.html',
  styleUrls: ['./reserva.component.css']
})
export class ReservaComponent implements OnInit {

  reserva: any | null = null;
  areasDisponibles: any[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {

    /* 1️⃣  history.state funciona en OnInit */
    this.reserva = history.state['reserva'] ?? null;

    /* 2) Si alguien recarga la página y se pierde el state,
          intenta reconstruir la reserva leyendo localStorage. */
    if (!this.reserva) {
      const data = localStorage.getItem('reservas');
      const reservas: any[] = data ? JSON.parse(data) : [];
      this.reserva = reservas[0] ?? null;   // o bien filtra por campos
    }

    /* 3) Nombres de áreas si los necesitas */
    if (window.DATA?.ambientes) this.areasDisponibles = window.DATA.ambientes;
  }

  obtenerNombreArea(id: string): string {
    const area = this.areasDisponibles.find(a => a.id == id);
    return area ? area.nombre : 'Área desconocida';
  }
}