import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es'; // español

declare global {
  interface Window {
    DATA: any;
  }
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  
  areasDisponibles: any[] = [];

  ngOnInit(): void {
    if (window.DATA && window.DATA.ambientes) {
      this.areasDisponibles = window.DATA.ambientes;
      console.log("Áreas cargadas:", this.areasDisponibles);
    } else {
      console.error('No se encontró window.DATA.ambientes');
    }
  }

  // areaSeleccionada: string = '';
fechaInicial: string = '';
fechaFinal: string = '';
 areaSeleccionada: number | null = null;
  adultos: number = 0;
  ninos: number = 0;

  
//  ❗  Mapa ficticio de reservas   (área → fecha ISO → array de horas ocupadas)
reservas: { [idArea: number]: { [fechaISO: string]: string[] } } = {
  1: { '2025-06-28': ['09:30', '10:45', '17:00'] },
  2: { '2025-06-28': ['10:45', '12:00'] },
  3: { '2025-06-29': ['07:00', '14:30'] }
};
 
// handleDateClick(arg: any) {
//   if (!this.areaSeleccionada) {
//     alert('Por favor, selecciona un área antes de elegir una fecha.');
//     return;
//   }

// }

mostrarCalendarioInicial: boolean = false;
mostrarCalendarioFinal: boolean = false;

horariosDisponibles: {start: string, end: string}[] = [];
horariosOcupados   : string[] = [];

// Simulando reservas por área
// reservasPorArea: { [areaId: number]: string[] } = {
//   1: ['09:00', '10:00', '16:30'],
//   2: ['11:30', '12:00', '12:30'],
//   3: ['07:30', '08:00'],
//   4: ['13:00', '14:00']
// };

// ---------- MÉTODOS ----------
buscarReservas() {
  if (!this.areaSeleccionada) { this.mostrarDialogo('errorSearch'); return; }
  if (!this.fechaInicial || !this.fechaFinal) { this.mostrarDialogo('errorFechas'); return; }

  // *Generar todos los turnos*
  this.horariosDisponibles = this.generarTurnos();

  // *Filtrar ocupados por área + fecha inicial*
  const fechaISO = this.fechaInicial;                  // ej 2025-06-28
  const ocupadosArea = this.reservas[this.areaSeleccionada] || {};
  this.horariosOcupados = ocupadosArea[fechaISO] || [];
  console.log('Ocupados para área-', this.areaSeleccionada, fechaISO, this.horariosOcupados);
}

generarTurnos() {
  const lista:{start:string,end:string}[] = [];
  const base = new Date('1970-01-01T07:00:00');
  const FIN  = new Date('1970-01-01T20:15:00');        // último inicio

  while (base <= FIN) {
    const start = base.toTimeString().substring(0,5);  // HH:MM
    const fin   = new Date(base.getTime() + 60*60*1000); // +1 h
    const end   = fin.toTimeString().substring(0,5);

    lista.push({ start, end });
    base.setMinutes(base.getMinutes() + 75);           // +1 h 15 min
  }
  return lista;
}

seleccionarHorario(h: {start:string,end:string}) {
  const dialog = document.getElementById('dialogConfirmation') as HTMLDialogElement;
  const span   = document.getElementById('selected-time');
  if (span) { span.textContent = `${h.start} - ${h.end}`; }
  dialog?.showModal();
}

mostrarDialogo(id:string) {
  const dlg = document.getElementById(id) as HTMLDialogElement;
  dlg?.showModal();
  setTimeout(()=>dlg?.close(),2500);
}



// buscarReservas() {
//   if (!this.areaSeleccionada) {
//     const dialog = document.getElementById('errorSearch') as HTMLDialogElement;
//     dialog?.showModal();
//     setTimeout(() => dialog?.close(), 2500); // Se cierra después de 2.5 segundos
//     return;
//   }

//   if (!this.fechaInicial || !this.fechaFinal) {
//     const dialog = document.getElementById('errorFechas') as HTMLDialogElement;
//     dialog?.showModal();
//     setTimeout(() => dialog?.close(), 2500);
//     return;
//   }

  // Si todo está correcto, continúa con la lógica de búsqueda
//   console.log('Área:', this.areaSeleccionada);
//   console.log('Fechas:', this.fechaInicial, '->', this.fechaFinal);
// }

}
