import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReservasService {

  constructor(
    private readonly http: HttpClient
  ) { }

  private apiUrl = 'https://1msr142f8c.execute-api.us-east-1.amazonaws.com/v1/reservas';
  private apiUrl2 = 'https://1msr142f8c.execute-api.us-east-1.amazonaws.com/v1/reservas';
  private apiUrlConfirmar = 'https://1msr142f8c.execute-api.us-east-1.amazonaws.com/v1/reservas';

  // Crear reserva
  __be_postreservas(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data, {responseType: "json"});
  }

  // Obtener reservas
  __be_getobtenerReservas(idusuario: number) {
  return this.http.get<{ data: any[] }>(
    `${this.apiUrl}?idusuario=${idusuario}`
  );
}

__be_CancelarReserva(idreserva: number) {
  const payload = { idreserva }; //lo envías como objeto
  const headers = { 'Content-Type': 'application/json' };

  console.log('📤 Enviando payload:', payload); // para debug

  return this.http.post(`${this.apiUrl2}/cancelarReserva`, payload, { headers });
}

//Confirmar reserva
  __be_patchconfirmarReserva(idreserva: number) {
  const body = {
    idreserva: idreserva,
    nuevo_estado: 'confirmado'
  };
  return this.http.patch(`${this.apiUrlConfirmar}`, body);
}


}
