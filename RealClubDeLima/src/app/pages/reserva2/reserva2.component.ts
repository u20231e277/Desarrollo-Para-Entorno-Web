import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReservasService } from 'src/app/services/reservas.service';

@Component({
  selector: 'app-reserva2',
  templateUrl: './reserva2.component.html',
  styleUrls: ['./reserva2.component.css']
})
export class Reserva2Component implements OnInit {
  reservas: any[] = [];             // Lista de reservas del usuario
  cargando: boolean = true;         // Loader mientras carga
  mensaje: string = '';             // Mensaje si no hay reservas o error
  // reservaSeleccionada: any = null;  // Para el modal de cancelación
   idReservaSeleccionada: number | null = null; // Guarda la reserva que se desea cancelar

  constructor(private rs: ReservasService, private router: Router) {}
  
  ngOnInit(): void {
        const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    if (!usuario.idusuario) {
      this.mensaje = 'No se encontró un usuario logueado.';
      this.cargando = false;
      return;
  }

this.rs.__be_getobtenerReservas(usuario.idusuario).subscribe({
      next: (response) => {
        console.log('Respuesta completa:', response);

        const parsedResponse = typeof response.data === 'string'
          ? JSON.parse(response.data)
          : response;

        this.reservas = parsedResponse.data || [];
        if (!this.reservas.length) {
          this.mensaje = 'No tienes reservas registradas.';
        }
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al obtener reservas:', err);
        this.mensaje = 'Ocurrió un error al cargar tus reservas.';
        this.cargando = false;
      }
    });
  }

  abrirModal(idreserva: number): void {
    this.idReservaSeleccionada = idreserva; // Guarda el ID
    const modal = document.getElementById('modalConfirmacion') as HTMLDialogElement;
    modal?.showModal();
  }

  cerrarModal(): void {
    const modal = document.getElementById('modalConfirmacion') as HTMLDialogElement;
    modal?.close();
    this.idReservaSeleccionada = null;
  }

  verDetalleReserva(reserva: any): void {
  // Guarda la reserva seleccionada en localStorage
  localStorage.setItem('reservaSeleccionada', JSON.stringify(reserva));
  // Redirige a la página de detalles
  this.router.navigate(['/reserva']);
}

  // Confirmar cancelación
 confirmarCancelacion(): void {
    if (!this.idReservaSeleccionada) return;

    this.rs.__be_CancelarReserva(this.idReservaSeleccionada).subscribe({
      next: (response) => {
        console.log('Cancelación exitosa:', response);
        this.reservas = this.reservas.filter(r => r.idreserva !== this.idReservaSeleccionada);
        this.cerrarModal();
      },
      error: (err) => {
        console.error('Error al cancelar reserva:', err);
        alert('❌ Error al cancelar la reserva');
        this.cerrarModal();
      }
    });
  }
}
