import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Persona } from '../domain/Persona';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PersonaServiceService {
  private url: string = 'http://localhost:8081/CentroSur/Usuario/';
  constructor(private http: HttpClient) {}

  registrar(persona: Persona): Observable<any> {
    this.url = this.url + 'registrarse';
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(persona);
    console.log(' pos p => ', body);

    return this.http.post(this.url, body, { headers: headers });
  }

  login(email: string, password: string): Observable<any> {
    console.log('url', this.url);

    const body = {};
    return this.http.post<any>(
      this.url + 'login?email=' + email + '&password=' + password,
      {
        params: {
          email: email,
          password: password,
        },
        observe: 'response',
      }
    );
  }
}
