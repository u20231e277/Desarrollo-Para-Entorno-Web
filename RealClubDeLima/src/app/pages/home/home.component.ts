import { NgFor } from '@angular/common';
import { Component, OnInit, OnDestroy, ChangeDetectorRef,  } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AmbientesService } from 'src/app/services/ambientes.service';
import { ReservasService } from 'src/app/services/reservas.service';
import { HorariosService } from 'src/app/services/horarios.service';

// declare global {
//   interface Window {
//     DATA: any;
//   }
// }

@Component({
  selector: 'app-home',
  // standalone: false,
  // imports: [NgFor],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  isAdmin: boolean = false;
    isSocio: boolean = false;
 
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
  horarios: any[] = [];
  horarioSeleccionado: any = null;
  
  fechaSeleccionada: string = '';
  horariosDisponibles: { start: string; end: string }[] = [];
  horariosOcupados: string[] = [];
  reservasConfirmadas: any[] = [];

  //Temporizador
  countdown    = 300;      // 5 min en segundos
  private timerID: any;    // referencia al setInterval

  

  constructor(
    private router: Router,
    private readonly ps: AmbientesService,
    private readonly rs: ReservasService,
    private readonly hs: HorariosService,
    private cd: ChangeDetectorRef,
  ) {}

  
  ambientes: any[] = [];

  __listar_Ambientes(){
    this.ps.__be_getAmbientes().subscribe((rest: any) => {
      this.ambientes = rest.data
      this.areasDisponibles = this.ambientes;            // <-- llena la lista completa
      this.areasFiltradas = [...this.areasDisponibles];
      console.log("Áreas cargadas:", this.areasDisponibles);
    })
  }

  
  ngOnInit(): void {

    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

        // Compara por rol
    if (usuario.rol === 'admin') {
      this.isAdmin = true;
    }else if (usuario.rol === 'socio') {
      this.isSocio = true;
    }

    this.__listar_Ambientes();
       this.areasFiltradas = [...this.areasDisponibles];

    // Cargar reservas
   // this.cargarReservas();

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


buscarHorarios(): void {
  if (!this.areaSeleccionada) {
      this.mostrarDialogo('errorSearch');
      return;
    }
  
  if (!this.fechaInicial || !this.fechaFinal) {
      this.mostrarDialogo('errorFechas');
      return;
    }

  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
  const idambiente = Number(this.areaSeleccionada); // convierte a número

  this.hs.__be_postHorariosConEstado(idambiente, this.fechaInicial, usuario.idusuario).subscribe({
    next: (response) => {
      console.log('Horarios obtenidos:', response);

      // Si la API devuelve un string JSON, parsearlo
      const body = typeof response.body === 'string'
        ? JSON.parse(response.body)
        : response.body;

      // Ahora asigna los horarios
      this.horarios = body.horarios || [];

      console.log('Horarios cargados:', this.horarios);
      this.cd.detectChanges();
    },
    error: (err) => {
      console.error('Error al obtener horarios:', err);
      alert('❌ Ocurrió un error al obtener los horarios');
    }
  });
}


// Buscar reservas
// buscarReservas(): void {
//   if (!this.areaSeleccionada || !this.fechaInicial) {
//     this.mostrarDialogo('errorSearch');
//     return;
//     // alert('Selecciona un área y una fecha para buscar horarios');
//     // return;
//   }

//   // Convertir el id del área a number
//   const idAmbiente = Number(this.areaSeleccionada);

//   this.hs.__be_postHorariosConEstado(idAmbiente, this.fechaInicial)
//     .subscribe({
// next: (response) => {
//   console.log('Horarios obtenidos:', response);

//   const body = JSON.parse(response.body); // Decodifica JSON del body
//   this.horarios = body.horarios;          // Asigna al array del HTML

//   console.log('Horarios procesados:', this.horarios);
// },
//       error: (err) => {
//         console.error('Error al obtener horarios:', err);
//         alert('❌ Error al obtener horarios disponibles');
//       }
//     });
// }

// buscarReservas(): void {
//     if (!this.areaSeleccionada) {
//       this.mostrarDialogo('errorSearch');
//       return;
//     }

//     if (!this.fechaInicial || !this.fechaFinal) {
//       this.mostrarDialogo('errorFechas');
//       return;
//     }

//     this.generarHorarios();
//     this.filtrarHorariosOcupados();
//   }


// generarHorarios(): void {
//   this.horariosDisponibles = [];

//   // Inicio: 7:00 AM
//   const inicio = new Date(`${this.fechaInicial}T07:00`);
//   // Fin: 9:00 PM
//   const fin = new Date(`${this.fechaInicial}T21:00`);

//   while (inicio < fin) {
//     // Hora de inicio
//     const start = inicio.toTimeString().substring(0, 5);

//     // Sumar 1 hora para el turno
//     const siguiente = new Date(inicio.getTime() + 60 * 60000);
//     const end = siguiente.toTimeString().substring(0, 5);

//     // Agregar al array
//     this.horariosDisponibles.push({ start, end });

//     // Sumar 1h15min (turno + limpieza de 15min)
//     inicio.setMinutes(inicio.getMinutes() + 75);
//   }
// }

  get yaTieneReservaDelDia(): boolean {
  return this.horarios.some(h =>
    (h.estado === 'pendiente' || h.estado === 'confirmado') &&
    h.fecha === this.fechaInicial
  );
}

seleccionarHorario(horario: any): void {
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

  // Revisar si el usuario actual ya tiene una reserva en el mismo área y fecha
  if (horario.estado !== 'libre') {
    // Si está bloqueado o confirmado, mostrar mensaje y bloquear selección
    this.mostrarDialogo('dialogError2');
    return;
  }

  this.horarioSeleccionado = horario;

  const modal = document.getElementById('dialogConfirmation') as HTMLDialogElement;
  if (modal) {
    document.getElementById('selected-time')!.textContent = `${horario.hora_inicio} – ${horario.hora_fin}`;
    modal.showModal();
  }
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

    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    const adultoss = Number(this.adultos) > 0 ? this.adultos : 0;
    const ninoss = Number(this.ninos) > 0 ? this.ninos : 0;

    const reserva = {
      idusuario: usuario.idusuario,
      idambiente: this.areaSeleccionada,
      fecha: this.fechaInicial,
      hora_inicio: this.horarioSeleccionado.hora_inicio,
      hora_fin: this.horarioSeleccionado.hora_fin,
      adultos: adultoss,
      ninos: ninoss,
    };

    console.log('Datos enviados:', reserva);

    // 🔥 Primero bloqueamos el horario seleccionado (amarillo)
    this.horarioSeleccionado.estado = 'bloqueado';

    // Guardamos la reserva en la BD
    this.rs.__be_postreservas(reserva).subscribe({
      next: (response) => {
        console.log('Reserva guardada:', response);

        // 🔄 Refrescar horarios desde la API para que Angular pinte los cambios
        this.buscarHorarios();

        // ✅ Mostrar mensaje de confirmación
        this.mostrarDialogo('dialogConfirmation');
        window.location.href = '/reserva2';

        // Limpiar selección
        this.horarioSeleccionado = null;
        this.adultos = 0;
        this.ninos = 0;
      },
      error: (err) => {
        console.error('Error al guardar reserva:', err);
        this.mostrarDialogo('dialogError2');

        // Si falla, liberar el bloqueo
        if (this.horarioSeleccionado) {
          this.horarioSeleccionado.estado = 'libre';
        }
      }
    });
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
    dlg.showModal();
    setTimeout(() => dlg.close(), 2000);
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
