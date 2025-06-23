import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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

    areaSeleccionada: string = '';
  fechaInicial: string = '';
  fechaFinal: string = '';
  horariosDisponibles: { start: string; end: string }[] = [];
  horariosOcupados: string[] = [];
  reservasConfirmadas: any[] = [];
  horarioSeleccionado: { start: string; end: string } | null = null;
  areasDisponibles: any[] = [];
  countdown    = 300;      // segundos (5 min)
private timerID: any;    // referencia al setInterval
 // router: any;

  ngOnInit(): void {
    if (window.DATA && window.DATA.ambientes) {
      this.areasDisponibles = window.DATA.ambientes;
      console.log("Áreas cargadas:", this.areasDisponibles);
    } else {
      console.error('No se encontró window.DATA.ambientes');
    }
     const confirmBtn = document.getElementById('confirm-button');
    const cancelBtn = document.getElementById('cancel-button');

    if (confirmBtn && cancelBtn) {
      confirmBtn.addEventListener('click', () => this.confirmarReserva());
      cancelBtn.addEventListener('click', () => {
        const modal = document.getElementById('dialogConfirmation') as HTMLDialogElement;
        modal?.close();
      });
    }

    this.cargarReservas();

  // Iniciar temporizador de 5 min
  this.iniciarTemporizador();
  this.cargarReservas();
  }

  // Arranca el conteo regresivo
iniciarTemporizador() {
  const intervalo = setInterval(() => {
    if (this.countdown > 0) {
      this.countdown--;
    } else {
      clearInterval(intervalo);

      // Mostrar modal de tiempo expirado
      this.mostrarDialogo('dialogTiempoExpirado');

      // Cerrar el modal y redirigir después de 2.5 segundos
      setTimeout(() => {
        this.router.navigate(['/inicio']);
      }, 2500);
    }
  }, 1000);
}


formatoTiempo(segundos: number): string {
  const minutos = Math.floor(segundos / 60);
  const restoSegundos = segundos % 60;
  return `${this.agregarCero(minutos)}:${this.agregarCero(restoSegundos)}`;
}

agregarCero(valor: number): string {
  return valor < 10 ? '0' + valor : valor.toString();
}

constructor(private router: Router) {}

// Buena práctica: detener el intervalo si el componente se destruye
ngOnDestroy(): void {
  clearInterval(this.timerID);
}

  adultos: number = 0;
  ninos: number = 0;

  
//  ❗  Mapa ficticio de reservas   (área → fecha ISO → array de horas ocupadas)
// reservas: { [idArea: number]: { [fechaISO: string]: string[] } } = {
//   1: { '2025-06-28': ['09:30', '10:45', '17:00'] },
//   2: { '2025-06-28': ['10:45', '12:00'] },
//   3: { '2025-06-29': ['07:00', '14:30'] }
// };
 
// handleDateClick(arg: any) {
//   if (!this.areaSeleccionada) {
//     alert('Por favor, selecciona un área antes de elegir una fecha.');
//     return;
//   }

// }

mostrarCalendarioInicial: boolean = false;
mostrarCalendarioFinal: boolean = false;

// horariosDisponibles: {start: string, end: string}[] = [];
// horariosOcupados   : string[] = [];

// Simulando reservas por área
// reservasPorArea: { [areaId: number]: string[] } = {
//   1: ['09:00', '10:00', '16:30'],
//   2: ['11:30', '12:00', '12:30'],
//   3: ['07:30', '08:00'],
//   4: ['13:00', '14:00']
// };

// ---------- MÉTODOS ----------
buscarReservas(): void {
    if (!this.areaSeleccionada) {
      this.mostrarDialogo('errorSearch');
      return;
    }

    if (!this.fechaInicial || !this.fechaFinal) {
      this.mostrarDialogo('errorFechas');
      return;
    }

    this.generarHorarios();
    this.filtrarHorariosOcupados();
  }

 generarHorarios(): void {
    this.horariosDisponibles = [];
    const inicio = new Date(`${this.fechaInicial}T07:00`);
    const fin = new Date(`${this.fechaInicial}T21:00`);

    while (inicio < fin) {
      const start = inicio.toTimeString().substring(0, 5);
      const siguiente = new Date(inicio.getTime() + 75 * 60000); // 1h + 15min
      const end = siguiente.toTimeString().substring(0, 5);

      this.horariosDisponibles.push({ start, end });
      inicio.setTime(siguiente.getTime());
    }
  }

seleccionarHorario(horario: { start: string; end: string }): void {
  const yaReservado = this.reservasConfirmadas.some(r =>
    r.area === this.areaSeleccionada &&
    r.fecha === this.fechaInicial
  );

  if (yaReservado) {
    const modalError = document.getElementById('dialogError2') as HTMLDialogElement;
    modalError?.showModal();
    setTimeout(() => modalError?.close(), 2500);
    return;
  }

  this.horarioSeleccionado = horario;
  const modal = document.getElementById('dialogConfirmation') as HTMLDialogElement;
  if (modal) {
    document.getElementById('selected-time')!.textContent = `${horario.start} – ${horario.end}`;
    modal.showModal();
  }
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

confirmarReserva(): void {
  if (this.horarioSeleccionado) {
    const yaReservado = this.reservasConfirmadas.some(r =>
      r.area === this.areaSeleccionada &&
      r.fecha === this.fechaInicial
    );

    if (yaReservado) {
      this.mostrarDialogo('dialogError2');
      return;
    }

    const reserva = {
      area: this.areaSeleccionada,
      fecha: this.fechaInicial,
      horaInicio: this.horarioSeleccionado.start,
      horaFin: this.horarioSeleccionado.end,
    };

    this.reservasConfirmadas.push(reserva);
    localStorage.setItem('reservas', JSON.stringify(this.reservasConfirmadas));

    this.filtrarHorariosOcupados();
    this.horarioSeleccionado = null;

    this.mostrarDialogo('dialogConfirmation');

  }
}


  filtrarHorariosOcupados(): void {
    const reservas = this.reservasConfirmadas.filter(
      r => r.area === this.areaSeleccionada && r.fecha === this.fechaInicial
    );
    this.horariosOcupados = reservas.map(r => r.horaInicio);
  }

  cargarReservas(): void {
    const data = localStorage.getItem('reservas');
    this.reservasConfirmadas = data ? JSON.parse(data) : [];
  }


mostrarDialogo(id: string): void {
  const dlg = document.getElementById(id) as HTMLDialogElement;
  if (!dlg) return;

  dlg.classList.remove('fade-out'); // Asegura que no tenga la clase previa
  dlg.showModal();

  setTimeout(() => {
    dlg.classList.add('fade-out');
    setTimeout(() => dlg.close(), 500); // Espera a que termine la transición
  }, 2000); // Mostrar el modal por 2s antes de empezar a desvanecer
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
