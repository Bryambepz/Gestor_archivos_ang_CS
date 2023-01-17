import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Persona } from '../../domain/Persona';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PersonaServiceService {
  private url: string = 'http://localhost:8081/CentroSur/Usuario/';
  constructor(private http: HttpClient) {}

  registrar(persona: Persona): Observable<Persona> {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(persona);
    console.log(' pos p => ', body);
    return this.http.post<Persona>(this.url + 'registrarse', body, { headers: headers });
  }

  login(email: string, password: string): Observable<any> {
    console.log('url', this.url);
    const headers = { 'content-type': 'application/json' };
    const body = {};
    return this.http.get<any>(
      // this.url + 'login?email=' + email + '&password=' + password,
      this.url + 'login',
      {
        headers: headers,
        params: {
          email: email,
          password: password,
        },
        observe: 'response',
      }
    );
  }

  getPersonas():Observable<Persona[]>{
    return this.http.get<Persona[]>(this.url + 'allUsers');
  }
}
