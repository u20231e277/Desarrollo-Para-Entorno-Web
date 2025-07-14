import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReservasService } from 'src/app/services/reservas.service';
import { NiubizService } from 'src/app/services/niubiz.service';
import { env } from 'src/environments/environment';

@Component({
  selector: 'app-reserva',
  templateUrl: './reserva.component.html',
  styleUrls: ['./reserva.component.css']
})
export class ReservaComponent implements OnInit {

  reserva: any = null;

  constructor(
    private router: Router,
    private rs: ReservasService,
    private niubizService: NiubizService
  ) {}

  private readonly expiration = env.niubizExpiration;
  private readonly merchantId = env.niubizMerchantId;
   reservaPendienteCancelacion: any = null;
   mensajeCancelacionMostrado: boolean = false;

  ngOnInit(): void {
    const reservaGuardada = localStorage.getItem('reservaSeleccionada');
    if (reservaGuardada) {
      this.reserva = JSON.parse(reservaGuardada);
    } else {
      // Redirigir si no hay reserva
      this.router.navigate(['/reserva2']);
    }
  }

    generarPurchaseNumber(): number {
    return Math.floor(Math.random() * 1000000000000);
  }

confirmarReserva(): void {
  if (!this.reserva?.idreserva) return;
  console.log('RESERVA:', this.reserva);
  // let metodo = null;
  if (this.reserva.costo_total <= 0) {
    this.rs.__be_patchconfirmarReserva(this.reserva.idreserva).subscribe({
    next: (res) => {
      console.log('Reserva confirmada:', res);

      // Actualiza el estado local
      this.reserva.estado = 'confirmado';

      // uestra el modal de éxito
      this.mostrarDialogo('modalConfirmacion');
      return ;
    },
    error: (err) => {
      console.error('Error al confirmar reserva:', err);

      // Muestra el modal de error
      const modalError = document.getElementById('modalError') as HTMLDialogElement;
      if (modalError) {
        modalError.showModal();
      }
      return;
    }
  });
  return ;
  }

  
    const amount = this.reserva.costo_total;
    const purchaseNumber = this.generarPurchaseNumber();
    this.niubizService.getNiubizSession(amount).subscribe({
      next: (sessionToken) => {
        const checkout = (window as any).VisanetCheckout;

        if (!checkout) {
          console.error('❌ VisanetCheckout no está disponible');
          return;
        }

        checkout.configure({
          sessiontoken: sessionToken.sessionKey,
          channel: 'web',
          merchantid: this.merchantId,
          purchasenumber: purchaseNumber,
          amount,
          expirationminutes: this.expiration,
          timeouturl: '/timeout',
          merchantlogo: '/assets/img/RCL-AZUL.svg',
          formbuttoncolor: '#29337c',
          action: '/success',
          showamount: 'true',
        });

        checkout.configuration.complete = (parametros: any) => {
          this.niubizService
            .getNiubizAuthorization(
              amount,
              purchaseNumber,
              parametros.channel,
              parametros.token
            )
            .subscribe({
              next: (authResponse: any) => {
                console.log('✅ Autorización exitosa:', authResponse);
                if(authResponse.dataMap && authResponse.dataMap.ACTION_CODE === '000'){
                  const metodo = authResponse.dataMap.BRAND.toLowerCase();
                  console.log('📤 Metodo:', metodo);  
                   this.rs.__be_patchconfirmarReserva(this.reserva.idreserva, metodo).subscribe({
                            next: (res) => {
                            console.log('Reserva confirmada:', res);


                            // Actualiza el estado local
                            this.reserva.estado = 'confirmado';
                            localStorage.setItem('reservationData', JSON.stringify(authResponse));
                            
                            console.log('📤 Redirecting to confirm page');
                            //window.location.href = '/confirm';
                            this.router.navigate(['/confirm']);

                            // muestra el modal de éxito
                            // this.mostrarDialogo('modalConfirmacion');
                            },
                            error: (err) => {
                    console.error('Error al confirmar reserva:', err);

                    // // Muestra el modal de error
                    // const modalError = document.getElementById('modalError') as HTMLDialogElement;
                    // if (modalError) {
                    //   modalError.showModal();
                    // }
                  }
                });
                  return;
                }
                // this.router.navigate(['/success']);
                // window.location.href = '/success';
               
                // document.getElementById('visaNetWrapper')?.remove();
                 window.location.href = '/error';
              },
              error: (authError: any) => {
                console.error('❌ Error en autorización:', authError);
                window.location.href = '/error';
                return;
              },
            });
        };

        checkout.open();
      },
      error: (error) => {
        console.error('❌ Error al obtener sesión:', error);
      },
    });
}

// cancelarReserva(): void {
//   if (!this.reserva?.idreserva) {
//     console.error('Falta idreserva');
//     alert('❌ No se encontró la información de la reserva');
//     return;
//   }

//   if (confirm('¿Seguro que deseas cancelar esta reserva?')) {
//     this.rs.__be_CancelarReserva(this.reserva.idreserva).subscribe({
//       next: (response) => {
//         console.log('✅ Reserva cancelada:', response);
//         alert('✅ Reserva cancelada correctamente');
//         this.router.navigate(['/reserva2']); // Redirige a la lista
//       },
//       error: (err) => {
//         console.error('❌ Error al cancelar la reserva:', err);
//         alert('❌ No se pudo cancelar la reserva');
//       }
//     });
//   }
// }

  cancelarReserva1(): void {
  if (this.reserva?.idreserva) {
    const modal = document.getElementById('dialogCancel') as HTMLDialogElement;
  modal?.showModal();
    return;
  }
}

confirmarCancelacion(): void {
  if (!this.reserva?.idreserva) return;

  this.rs.__be_CancelarReserva(this.reserva.idreserva).subscribe({
    next: (res) => {
      console.log('Reserva cancelada:', res);

      // ✅ Mostrar mensaje dentro del modal
      this.mensajeCancelacionMostrado = true;

      // ⏳ Esperar 2 segundos y luego cerrar modal + redirigir
      setTimeout(() => {
        const modal = document.getElementById('dialogCancel') as HTMLDialogElement;
        if (modal) modal.close();

        // 🔄 Redirigir a reserva2
        this.router.navigate(['/reserva2']);
      }, 2000);
    },
    error: (err) => {
      console.error('Error al cancelar reserva:', err);
      this.mensajeCancelacionMostrado = false;
      alert('❌ Ocurrió un error al cancelar la reserva');
    }
  });
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
  const modal = document.getElementById('dialogCancel') as HTMLDialogElement;
  if (modal) modal.close();
}

}
