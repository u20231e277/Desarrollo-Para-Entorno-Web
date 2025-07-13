import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ReservasService } from 'src/app/services/reservas.service';

declare global {
  interface Window {
    DATA: any;
  }
}

@Component({
  selector: 'app-reserva2',
  templateUrl: './reserva2.component.html',
  styleUrls: ['./reserva2.component.css']
})
export class Reserva2Component implements OnInit {

  constructor(private router: Router, 
    private readonly rs: ReservasService,
    private ar: ActivatedRoute) { }

    reserva: any = []

    __obtener_reservas(id: any){
      this.rs.__be_getreserva(id).subscribe((rest: any) => {
      this.reserva = rest.data
      console.log(this.reserva)
      })
    }

    ngOnInit(): void {
    this.ar.params.subscribe((params: Params) => {
      if(params["idusuario"]) {
        this.__obtener_reservas(params["idusuario"])
      }
    })
  }





  reservas: any[] = [];
  areasDisponibles: any[] = [];
  ambientes: any[] = [];
  reservaPendienteCancelacion: any = null;
  mensajeCancelacionMostrado: boolean = false;

  

  // ngOnInit(): void {
  //   // Cargar áreas desde window.DATA
  //   if (window.DATA && window.DATA.ambientes) {
  //     this.areasDisponibles = window.DATA.ambientes;
  //   }

  //   // Leer reservas desde localStorage
  //   const data = localStorage.getItem('reservas');
  //   this.reservas = data ? JSON.parse(data) : [];
  // }

obtenerImagen(id: any): string {
  const idStr = String(id);  // convierte a string por si es número
  switch (idStr) {
    case '1': return 'assets/img/cancha01.jpg';
    case '2': return 'assets/img/cancha02.jpg';
    case '3': return 'assets/img/futbol12.jpg';
    case '4': return 'assets/img/futbol6.jpg';
    default: return 'assets/img/default.jpg';
    
  }
  
}

  // getNombreArea(id: string): string {
  //   const area = this.areasDisponibles.find(a => a.id === id);
  //   return area ? area.nombre : 'Área desconocida';
  // }

  obtenerNombreArea(id: string): string {
  const area = this.areasDisponibles.find(a => a.id == id);
  return area ? area.nombre : 'Área desconocida';
}


  // cancelarReserva(index: number): void {
  //   if (confirm('¿Estás seguro de cancelar esta reserva?')) {
  //     this.reservas.splice(index, 1);
  //     localStorage.setItem('reservas', JSON.stringify(this.reservas));
  //   }
  // }
  // cancelarReserva(index: number): void {
  //   if (confirm('¿Deseas cancelar esta reserva?')) {
  //     this.reservas.splice(index, 1);
  //     localStorage.setItem('reservas', JSON.stringify(this.reservas));
  //   }
  // }

  cancelarReserva(reserva: any): void {
  this.reservaPendienteCancelacion = reserva;
  const modal = document.getElementById('dialogCancel') as HTMLDialogElement;
  modal?.showModal();
}

confirmarCancelacion(): void {
  if (this.reservaPendienteCancelacion) {
    this.reservas = this.reservas.filter(r => r !== this.reservaPendienteCancelacion);
    localStorage.setItem('reservas', JSON.stringify(this.reservas));
    this.reservaPendienteCancelacion = null;

    this.mensajeCancelacionMostrado = true; // mostrar mensaje
  }

  setTimeout(() => {
    this.mensajeCancelacionMostrado = false; // ocultar mensaje
    this.cerrarModal(); // cerrar modal
  }, 2000);
}


cerrarModal(): void {
  const modal = document.getElementById('dialogCancel') as HTMLDialogElement;
  modal?.close();
}

verDetalle(reserva: any) {
    /* Navega a /reserva-detalle enviando todo el objeto
       en el “navigation state”.  Sin tocar nada más.      */
    this.router.navigate(['reserva'], { state: { reserva } });
  }

}
