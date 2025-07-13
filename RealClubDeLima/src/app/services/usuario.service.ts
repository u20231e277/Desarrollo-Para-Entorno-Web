import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private apiUrl = 'https://9ceoxvw7mb.execute-api.us-east-1.amazonaws.com/realClubLima/usuario';

  constructor(
    private readonly http: HttpClient
  ) { }

__be_postvalidarUsuario(codigo: string, clave: string): Observable<any> {
    const payload = { codigo, clave };
    return this.http.post(this.apiUrl, payload);
  }
}
