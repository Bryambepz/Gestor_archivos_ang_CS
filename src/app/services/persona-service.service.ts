import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Persona } from '../domain/Persona';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PersonaServiceService {
  private url: string = 'http://localhost:8081/CentroSur/Usuario/registrarse';
  constructor(private http: HttpClient) {}

  registrar(persona: Persona): Observable<any> {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(persona);
    console.log(" pos p => ", body);
    
    return this.http.post(this.url, body, {'headers':headers});
  }
}
