import { NgFor } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AmbientesService } from 'src/app/services/ambientes.service';

declare global {
  interface Window {
    DATA: any;
  }
}

@Component({
  selector: 'app-home',
  // standalone: false,
  // imports: [NgFor],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

 
  fechaInicial: string = '';
  fechaFinal: string = '';
  adultos: number = 0;
  ninos: number = 0;
  totalInvitados: number = 0;
  maxInvitados: number = 5;

  //Areas
  textoBusqueda: string = '';
  areasDisponibles: any[] = [];
  areasFiltradas: any[] = [];
  areaSeleccionada: string = '';

  //Reservas
  horariosDisponibles: { start: string; end: string }[] = [];
  horariosOcupados: string[] = [];
  reservasConfirmadas: any[] = [];
  horarioSeleccionado: { start: string; end: string } | null = null;

  //Temporizador
  countdown    = 300;      // 5 min en segundos
  private timerID: any;    // referencia al setInterval

  constructor(private router: Router,
    private readonly ps: AmbientesService
  ) {}

  ambientes: any[] = [];

  __listar_Ambientes(){
    this.ps.__be_getAmbientes().subscribe((rest: any) => {
      this.ambientes = rest.data
      console.log(this.ambientes)
    })
  }

  ngOnInit(): void {

    this.__listar_Ambientes();

    // if (window.DATA && window.DATA.ambientes) {
    //   this.areasDisponibles = window.DATA.ambientes;
       this.areasFiltradas = [...this.areasDisponibles];
    //   //console.log("Áreas cargadas:", this.areasDisponibles);
    // } else {
    //   console.error('No se encontró window.DATA.ambientes');
    // }

    // Cargar reservas
    this.cargarReservas();

    // Iniciar temporizador de 5 min
    this.iniciarTemporizador();

    // Configurar botones del modal
    const confirmBtn = document.getElementById('confirm-button');
    const cancelBtn = document.getElementById('cancel-button');

    if (confirmBtn && cancelBtn) {
      confirmBtn.addEventListener('click', () => this.confirmarReserva());
      cancelBtn.addEventListener('click', () => {
        const modal = document.getElementById('dialogConfirmation') as HTMLDialogElement;
        modal?.close();
      });
    }
  }

  // Buena práctica: detener el intervalo si el componente se destruye
  ngOnDestroy(): void {
    clearInterval(this.timerID); // Detener temporizador al salir
  }


  // Filtra areas
  filtrarAreas(): void {
  // Normaliza el texto de búsqueda
  const filtro = (this.textoBusqueda || '').toLowerCase();

  // Filtra las áreas disponibles según el texto de búsqueda
  this.areasFiltradas = this.areasDisponibles.filter(area =>
    area.nombre.toLowerCase().includes(filtro)
  );
  }

  // Inicia el temporizador
  iniciarTemporizador() {
  const intervalo = setInterval(() => {
    if (this.countdown > 0) {
      this.countdown--; // Contar el tiempo
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

// Buscar reservas
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

//  generarHorarios(): void {
//     this.horariosDisponibles = [];
//     const inicio = new Date(`${this.fechaInicial}T07:00`);
//     const fin = new Date(`${this.fechaInicial}T21:00`);

//     while (inicio < fin) {
//       const start = inicio.toTimeString().substring(0, 5);
//       const siguiente = new Date(inicio.getTime() + 75 * 60000); // 1h + 15min
//       const end = siguiente.toTimeString().substring(0, 5);

//       this.horariosDisponibles.push({ start, end });
//       inicio.setTime(siguiente.getTime());
//     }
//   }

generarHorarios(): void {
  this.horariosDisponibles = [];

  // Inicio: 7:00 AM
  const inicio = new Date(`${this.fechaInicial}T07:00`);
  // Fin: 9:00 PM
  const fin = new Date(`${this.fechaInicial}T21:00`);

  while (inicio < fin) {
    // Hora de inicio
    const start = inicio.toTimeString().substring(0, 5);

    // Sumar 1 hora para el turno
    const siguiente = new Date(inicio.getTime() + 60 * 60000);
    const end = siguiente.toTimeString().substring(0, 5);

    // Agregar al array
    this.horariosDisponibles.push({ start, end });

    // Sumar 1h15min (turno + limpieza de 15min)
    inicio.setMinutes(inicio.getMinutes() + 75);
  }
}

  seleccionarHorario(horario: { start: string; end: string }): void {
  const yaReservado = this.reservasConfirmadas.some(r =>
    r.area === this.areaSeleccionada &&
    r.fecha === this.fechaInicial
  );

    if (yaReservado) {
      this.mostrarDialogo('dialogError2');
      return;
    }

    this.horarioSeleccionado = horario;
    const modal = document.getElementById('dialogConfirmation') as HTMLDialogElement;
    if (modal) {
    document.getElementById('selected-time')!.textContent = `${horario.start} – ${horario.end}`;
    modal.showModal();
    }
  }

// generarTurnos() {
//   const lista:{start:string,end:string}[] = [];
//   const base = new Date('1970-01-01T07:00:00');
//   const FIN  = new Date('1970-01-01T20:15:00');        // último inicio

//   while (base <= FIN) {
//     const start = base.toTimeString().substring(0,5);  // HH:MM
//     const fin   = new Date(base.getTime() + 60*60*1000); // +1 h
//     const end   = fin.toTimeString().substring(0,5);

//     lista.push({ start, end });
//     base.setMinutes(base.getMinutes() + 75);           // +1 h 15 min
//   }
//   return lista;
// }

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
      adultos: this.adultos,
      ninos: this.ninos,
    };

    this.reservasConfirmadas.push(reserva);
    localStorage.setItem('reservas', JSON.stringify(this.reservasConfirmadas));

    this.filtrarHorariosOcupados();
    this.horarioSeleccionado = null;
    this.adultos = 0;
    this.ninos = 0;

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

  // Función para abrir y cerrar el menú de invitados
 invitadosAbierto: boolean = false;
 mostrarInvitados: boolean = false;

toggleInvitados() {
  this.mostrarInvitados = !this.mostrarInvitados;
}

cambiarAdultos(valor: number): void {
  const nuevoTotal = this.totalInvitados + valor;
  if (nuevoTotal >= 0 && nuevoTotal <= this.maxInvitados) {
    this.adultos += valor;
    this.totalInvitados = this.adultos + this.ninos;
  }
}

cambiarNinos(valor: number): void {
  const nuevoTotal = this.totalInvitados + valor;
  if (nuevoTotal >= 0 && nuevoTotal <= this.maxInvitados) {
    this.ninos += valor;
    this.totalInvitados = this.adultos + this.ninos;
  }
}

// Función para abrir y cerrar el calendario
calendarioAbierto: string | null = null;

toggleCalendario(tipo: string): void {
  this.calendarioAbierto = this.calendarioAbierto === tipo ? null : tipo;
}

//Función para actualizar la fecha inicial y final
actualizarFechaInicial(event: Event): void {
  const input = event.target as HTMLInputElement;
  const fecha = input.value;

  this.fechaInicial = fecha;

  // Ajusta la fecha final si es menor o no está definida
  if (!this.fechaFinal || this.fechaFinal < this.fechaInicial) {
    this.fechaFinal = this.fechaInicial;
  }

  this.calendarioAbierto = null;
}
}
