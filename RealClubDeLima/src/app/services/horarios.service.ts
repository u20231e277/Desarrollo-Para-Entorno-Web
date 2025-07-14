import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HorariosService {
  private apiUrl = 'https://1msr142f8c.execute-api.us-east-1.amazonaws.com/v1/horarios';

  constructor(private http: HttpClient) {}


  __be_postHorariosConEstado(idambiente: number, fecha: string, idusuario: number) {
  const data = { idambiente, fecha, idusuario };
  return this.http.post<any>(`${this.apiUrl}`, data, { responseType: "json" });
}

}
