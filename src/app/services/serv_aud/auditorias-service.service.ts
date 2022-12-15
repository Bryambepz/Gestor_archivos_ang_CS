import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Desc_Proyecto } from 'src/app/domain/Desc_Proyecto';
import { Info_Proceso } from 'src/app/domain/Info_Proceso';
import { Proceso } from 'src/app/domain/Proceso';
import { Proyecto } from 'src/app/domain/Proyecto';

@Injectable({
  providedIn: 'root',
})
export class AuditoriasServiceService {
  private url: string = 'http://localhost:8081/CentroSur/Auditorias/';
  constructor(private http: HttpClient) {}

  crearProyecto(proyecto: Proyecto, cedula:string): Observable<Proyecto> {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(proyecto);
    return this.http.post<Proyecto>(this.url + 'proyecto', body, {
      headers: headers,
      params: {
        cedulaLogin: cedula
      }
    });
  }

  getProyectos():Observable<Proyecto[]>{
    return this.http.get<Proyecto[]>(this.url + 'getProyectos');
  }

  descripcionProyecto(desc_pro:Desc_Proyecto, titulo:string):Observable<Desc_Proyecto>{
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(desc_pro);
    return this.http.post<Desc_Proyecto>(this.url + 'descripcion_proyecto', body, {
      headers: headers,
      params: {nombreP: titulo}
    });
  }

  getDescripciones():Observable<Desc_Proyecto[]>{
    return this.http.get<Desc_Proyecto[]>(this.url + 'getDescripciones');
  }

  getDescByProyecto(proyecto:string):Observable<Desc_Proyecto[]>{
    return this.http.get<Desc_Proyecto[]>(this.url + 'getDescripcionByProyecto', {
      params: {
        proyecto: proyecto
      }
    })
  }

  crearProceso(indentificador: string, proceso: Proceso):Observable<Proceso>{
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(proceso);    
    console.log(body);
    
    return this.http.post<Proceso>(this.url + 'proceso', body, {
      headers: headers,
      params: {identificadorProyecto: indentificador}
    });
  }

  getProcesos():Observable<Proceso[]>{
    return this.http.get<Proceso[]>(this.url + 'getProcesos');
  }

  getProcesoBy(descripcion:string):Observable<Proceso[]>{
    return this.http.get<Proceso[]>(this.url + 'getProcesosByProy', {
      params: {
        proy_desc: descripcion
      }
    });
  }

  informacionProceso( info_p:Info_Proceso, proceso: number, id_descrip:string ){
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(info_p);    
    console.log(body);
    return this.http.post(this.url + 'AdjuntarInformacion', body,{
      headers: headers,
      params: {
        proceso: proceso,
        id_descrip: id_descrip
      }
    })
  }

  getInformacionBy( id_descrip:string, proceso: number):Observable<Info_Proceso[]>{
    return this.http.get<Info_Proceso[]>(this.url + 'getInfoProcesoBy', {
      params: {
        id_descripcion: id_descrip,
        proceso: proceso
      }
    })
  }
}
