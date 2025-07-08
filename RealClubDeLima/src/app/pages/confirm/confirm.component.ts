import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

interface ReservationData {
  id: string;
  date: Date;
  time: string;
  guests?: number;
  service?: string;
  customerName?: string;
  email?: string;
}

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css']
})
export class ConfirmComponent implements OnInit {
  reservationData: ReservationData | null = null;
  contactPhone: string = '+1 (555) 123-4567';
  showAnimation: boolean = false;

  constructor(
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.loadReservationData();
    this.triggerAnimation();
  }

  /**
   * Carga los datos de la reserva desde el estado de navegación o localStorage
   */
  private loadReservationData(): void {
    // Intentar obtener datos del estado de navegación
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      this.reservationData = navigation.extras.state as ReservationData;
    } else {
      // Fallback: obtener desde localStorage
      const storedData = localStorage.getItem('reservationData');
      if (storedData) {
        try {
          this.reservationData = JSON.parse(storedData);
          // Limpiar localStorage después de usar los datos
          localStorage.removeItem('reservationData');
        } catch (error) {
          console.error('Error parsing reservation data:', error);
        }
      }
    }

    // Datos de ejemplo si no hay datos reales
    if (!this.reservationData) {
      this.reservationData = {
        id: this.generateReservationId(),
        date: new Date(),
        time: '19:00',
        guests: 2,
        service: 'Cena',
        customerName: 'Usuario'
      };
    }
  }

  /**
   * Genera un ID único para la reserva
   */
  private generateReservationId(): string {
    return 'RES-' + Date.now().toString().slice(-6);
  }

  /**
   * Activa la animación de éxito
   */
  private triggerAnimation(): void {
    setTimeout(() => {
      this.showAnimation = true;
    }, 300);
  }

  /**
   * Navega de vuelta al inicio
   */
  goToHome(): void {
    this.router.navigate(['/']);
  }

  /**
   * Navega a la página de detalles de la reserva
   */
  viewReservation(): void {
    if (this.reservationData) {
      this.router.navigate(['/reservations', this.reservationData.id]);
    }
  }

  /**
   * Navega hacia atrás en el historial
   */
  goBack(): void {
    this.location.back();
  }

  /**
   * Envía el correo de confirmación nuevamente
   */
  resendConfirmation(): void {
    // Aquí implementarías la lógica para reenviar el correo
    console.log('Reenviando confirmación...');
    // Mostrar mensaje de éxito o toast
  }

  /**
   * Comparte la reserva (por ejemplo, en redes sociales)
   */
  shareReservation(): void {
    if (navigator.share && this.reservationData) {
      navigator.share({
        title: 'Mi Reserva',
        text: `Reserva confirmada para el ${this.reservationData.date}`,
        url: window.location.href
      });
    }
  }

  /**
   * Descarga el comprobante de la reserva
   */
  downloadReceipt(): void {
    // Implementar lógica para generar y descargar PDF
    console.log('Descargando comprobante...');
  }
}