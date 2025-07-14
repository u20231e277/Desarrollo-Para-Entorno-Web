import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

interface ReservationData {
  dataMap: any;
}

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css']
})
export class ConfirmComponent implements OnInit {
  reservationData: ReservationData | null = null;
  contactPhone: string = '+1 (51) 207-0760';
  showAnimation: boolean = false;
  date: string = '';
  time: string = '';

  constructor(
    private router: Router,
    private location: Location
  ) {
    this.date = new Date().toLocaleDateString('es-ES');
    this.time = new Date().toLocaleTimeString('es-ES');
  }

  ngOnInit(): void {
    this.loadReservationData();
    this.triggerAnimation();
  }

  /**
   * Carga los datos de la reserva desde el estado de navegación o localStorage
   */
  private loadReservationData(): void {
    // Intentar obtener datos del estado de navegación
    // const navigation = this.router.getCurrentNavigation();
    // if (navigation?.extras?.state) {
    //   this.reservationData = navigation.extras.state as ReservationData;
    // } else {
      // Fallback: obtener desde localStorage
      const storedData = localStorage.getItem('reservationData');
      console.log('📤 storedData:', storedData);
      
      if (storedData) {
        try {
          this.reservationData = JSON.parse(storedData);
          // Limpiar localStorage después de usar los datos
          localStorage.removeItem('reservationData');
        } catch (error) {
          console.error('Error parsing reservation data:', error);
          window.location.href = '/inicio';
        }
        
      }
      else{
        window.location.href = '/inicio';
      }
    // }

    // Datos de ejemplo si no hay datos reales
    // if (!this.reservationData) {
    // }
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
      this.router.navigate(['/reservations', this.reservationData.dataMap.TRANSACTION_ID]);
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
        text: `Reserva confirmada para el ${this.reservationData.dataMap.TRANSACTION_DATE.split('T')[0]}`,
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