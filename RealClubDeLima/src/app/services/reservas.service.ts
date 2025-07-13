import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReservasService {

  constructor(
    private readonly http: HttpClient
  ) { }

   __be_getreserva(param: string) {
    return this.http.get("https://1msr142f8c.execute-api.us-east-1.amazonaws.com/v1/reservas?idusuario=" + param, {responseType: "json"})
  }

   __be_postreservas(data: any){
     return this.http.post("https://1msr142f8c.execute-api.us-east-1.amazonaws.com/v1/reservas", data, {responseType: "json"});
  }
}
