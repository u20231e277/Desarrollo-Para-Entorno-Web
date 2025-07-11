import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AmbientesService {

  constructor(
    private readonly http: HttpClient
  ) { }

  __be_getAmbientes(){
    return this.http.get("https://1msr142f8c.execute-api.us-east-1.amazonaws.com/v1/ambientes", { responseType: "json" });
  }
}
