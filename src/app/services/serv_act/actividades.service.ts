import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Actividad_Gen } from 'src/app/domain/Actividad_Gen';

@Injectable({
  providedIn: 'root',
})
export class ActividadesService {
  private url: string = 'http://localhost:8081/CentroSur/Actividad/';
  constructor(private http: HttpClient) {}

  crearActividad(actividad: Actividad_Gen, cedula:string): Observable<Actividad_Gen> {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(actividad);
    body.replace(
      actividad.fecha_fin.toString(),
      actividad.fecha_fin.toLocaleDateString()
    );
    const bd = body.substring(0,body.length-16)+"\"}";
    console.log(' pos p => ', bd);
    return this.http.post<Actividad_Gen>(
      this.url + 'ingresar_actividad',bd,
      { headers: headers,
      params: {cedula:cedula} }
    );
  }
}
