import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReservasService } from 'src/app/services/reservas.service';

@Component({
  selector: 'app-reserva',
  templateUrl: './reserva.component.html',
  styleUrls: ['./reserva.component.css']
})
export class ReservaComponent implements OnInit {

  reserva: any = null;

  constructor(
    private router: Router,
    private rs: ReservasService
  ) {}

  ngOnInit(): void {
    const reservaGuardada = localStorage.getItem('reservaSeleccionada');
    if (reservaGuardada) {
      this.reserva = JSON.parse(reservaGuardada);
    } else {
      // Redirigir si no hay reserva
      this.router.navigate(['/reserva2']);
    }
  }

confirmarReserva(): void {
  if (!this.reserva?.idreserva) return;

  this.rs.__be_patchconfirmarReserva(this.reserva.idreserva).subscribe({
    next: (res) => {
      console.log('Reserva confirmada:', res);

      // 🔄 Actualiza el estado local
      this.reserva.estado = 'confirmado';

      // ✅ Muestra el modal de éxito
      this.mostrarDialogo('modalConfirmacion');
    },
    error: (err) => {
      console.error('Error al confirmar reserva:', err);

      // Muestra el modal de error
      const modalError = document.getElementById('modalError') as HTMLDialogElement;
      if (modalError) {
        modalError.showModal();
      }
    }
  });
}



cancelarReserva(): void {
  if (!this.reserva?.idreserva) {
    console.error('Falta idreserva');
    alert('❌ No se encontró la información de la reserva');
    return;
  }

  if (confirm('¿Seguro que deseas cancelar esta reserva?')) {
    this.rs.__be_CancelarReserva(this.reserva.idreserva).subscribe({
      next: (response) => {
        console.log('✅ Reserva cancelada:', response);
        alert('✅ Reserva cancelada correctamente');
        this.router.navigate(['/reserva2']); // Redirige a la lista
      },
      error: (err) => {
        console.error('❌ Error al cancelar la reserva:', err);
        alert('❌ No se pudo cancelar la reserva');
      }
    });
  }
}



  volver(): void {
    this.router.navigate(['/reserva2']);
  }

  mostrarDialogo(id: string): void {
    const dlg = document.getElementById(id) as HTMLDialogElement;
    if (!dlg) return;
    dlg.showModal();
    setTimeout(() => dlg.close(), 2000);
  }

  cerrarModal(): void {
  const modal = document.getElementById('modalConfirmacion') as HTMLDialogElement;
  if (modal) {
    modal.close();
  }
}
}
