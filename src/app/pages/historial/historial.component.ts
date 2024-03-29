import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { timeout, timer } from 'rxjs';
import { Desc_Proyecto } from 'src/app/domain/Desc_Proyecto';
import { Info_Proceso } from 'src/app/domain/Info_Proceso';
import { Persona } from 'src/app/domain/Persona';
import { Proceso } from 'src/app/domain/Proceso';
import { Proyecto } from 'src/app/domain/Proyecto';
import { AuditoriasServiceService } from 'src/app/services/serv_aud/auditorias-service.service';
import { PersonaServiceService } from 'src/app/services/serv_per/persona-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HistorialComponent implements OnInit {
  proyectos: Proyecto[] = [];
  desc_proyectos: Desc_Proyecto[] = [];
  procesos: Proceso[] = [];
  registros: Info_Proceso[] = [];

  proyectoSeleccionado: string = '';
  descripcionSeleccionado: string = '';
  registroSeleccionado: string = '';
  procesoSeleccionado: number = 0;
  tituloS:string = '';
  adminRol:boolean = false;
  persona:Persona = new Persona();

  info_proceso_seleccionado: string[] = [];

  constructor(
    private servAuditorias: AuditoriasServiceService,
    private servPersona: PersonaServiceService, 
    private router: Router
  ) {}

  ngOnInit(): void {
    if (localStorage.getItem('ced_log') === '') {
      this.router.navigate(['/login']);
    }
    this.servPersona.getPersonas().subscribe((d) => {
      d.forEach(f => {        
        this.persona = (f.cedula == localStorage.getItem('ced_log'))? f:new Persona();
      })
      if(this.persona.rol == 'Administrador'){
        this.adminRol = true;
      }
    })
    this.listarProyectos();
  }

  listarProyectos() {
    this.servAuditorias.getProyectos().subscribe((d) => {
      this.proyectos = d.sort((a,b) => b.id-a.id);
    });
  }

  listarInformacion() {
    this.servAuditorias
      .getInformacionBy(this.descripcionSeleccionado, this.procesoSeleccionado)
      .subscribe((d) => {
        this.registros = d.sort((a,b) => a.id-b.id);
        console.log("ordd > ",this.registros);
        
        if (this.registros.length > 0) {
          this.accionDiv('tbl_info');
        } else {
          window.alert('Este proceso no tiene adjuntos por el momento');
        }
      });
  }

  clickTProceso(titulo: string, nproc: number) {
    this.descripcionSeleccionado = titulo;
    this.procesoSeleccionado = nproc;
    this.listarInformacion();
  }

  clickTHistorial(titulo: string) {
    var doc = document.getElementById('id_contenido');
    doc!.style.display = '';
    this.proyectoSeleccionado = titulo;
    // console.log(titulo);
    this.desc_proyectos = [];
    this.procesos = [];
    this.registros = [];

    this.servAuditorias.getDescByProyecto(titulo).forEach((d) => {
      this.desc_proyectos = d;
      this.desc_proyectos = this.desc_proyectos.sort(
        (a, b) =>
          new Date(a.fecha_emision).getTime() -
          new Date(b.fecha_emision).getTime()
      );
      d.forEach((d2) => {
        console.log("ident > ", d2.identificador_desc);
        
        this.servAuditorias
          .getProcesoBy(d2.identificador_desc)
          .forEach((f_d2) => {
            
            for (let i = 0; i < f_d2.length; i++) {
              f_d2[i].identificador = d2.identificador_desc;
              this.procesos.push(f_d2[i]);
            }
            this.procesos = this.procesos.sort((a, b) => b.proceso - a.proceso);
          });
      });
    });
  }

  accionDiv(id: string) {
    try {
      var contenido = document.getElementById(id);
      contenido!.style.display = '';
    } catch (error) {
      console.log(error);
    }
  }

  chang(opcion: string, id: number, licencia: string){
    this.info_proceso_seleccionado = [];
    this.tituloS = opcion.split('|')[1];
    opcion = opcion.split('|')[0];

    if (opcion == 'editProy') {

      this.info_proceso_seleccionado.push(this.proyectoSeleccionado);
      this.info_proceso_seleccionado.push(licencia);
      this.info_proceso_seleccionado.push(id.toString());      

      Swal.fire({
        icon: 'warning',
        title: 'Seleccione que desea modificar',
        input: 'radio',
        inputOptions: {
          editarTitulo: 'Editar Titulo',
          editarDesc: 'Editar Descripcion',
          editarProceso: 'Editar Proceso',
          // editarAdjunto: 'Editar Adjuntos',
        },
        showCloseButton: true,
        inputValidator: result => new Promise((d) => {
          // Titulo
          if(result == 'editarTitulo'){
            localStorage.setItem(
              'editar',
              this.info_proceso_seleccionado.toString()
            );
            this.router.navigate(['/auditorias'], {
              queryParams: { estado: 'editarTitulo' },
            });          
          // Descripcion Proy
          }else if(result == 'editarDesc'){
            localStorage.setItem(
              'editar',
              this.info_proceso_seleccionado.toString()
            );
            this.router.navigate(['/auditorias'], {
              queryParams: { estado: 'editarDescripcion' },
            });            
          // Proceso
          }else if(result == 'editarProceso'){
            localStorage.setItem(
              'editar',
              this.info_proceso_seleccionado.toString()
            );
            this.router.navigate(['/auditorias'], {
              queryParams: { estado: 'editarProceso' },
            });            
          }
          if(result != null){
            Swal.fire(
              {position: 'center',
              icon: 'success',
              showConfirmButton: false,
              timer: 1000}
              )
            }else{
              Swal.fire({
              showConfirmButton: false,
              timer: 1
            })
          }

        })
      })
    } else if(opcion == 'delet'){
      Swal.fire({
        icon: 'warning',
        title: 'Eliminar este proceso',
        text: 'Está seguro de eliminar este proceso y sus adjuntos',
        confirmButtonText: 'Si',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#3a63a5',
        cancelButtonColor: 'rgb(221, 51, 51)',
      }).then((d) => {
        if (d.isConfirmed) {
          this.servAuditorias
            .eliminarProceso(this.proyectoSeleccionado, licencia, id)
            .subscribe((d) => {
              console.log('se elimino? ', d);
              this.clickTHistorial(this.proyectoSeleccionado);
              Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'El proceso ha sido eliminado',
                showConfirmButton: false,
                timer: 1500
              })
            });
        }
      });
    }else if(opcion == "editAdjunto"){
      this.info_proceso_seleccionado.push(this.proyectoSeleccionado);
      this.info_proceso_seleccionado.push(licencia);
      this.info_proceso_seleccionado.push(id.toString());       

      localStorage.setItem(
        'editar',
        this.info_proceso_seleccionado.toString()
      );
      localStorage.setItem(
        'tituloS',
        this.tituloS
      )
      this.router.navigate(['/auditorias'], {
        queryParams: { estado: 'editarAdjuntos' },
      }); 
    }
  }
}
