import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Desc_Proyecto } from 'src/app/domain/Desc_Proyecto';
import { Info_Proceso } from 'src/app/domain/Info_Proceso';
import { Proceso } from 'src/app/domain/Proceso';
import { Proyecto } from 'src/app/domain/Proyecto';
import { AuditoriasServiceService } from 'src/app/services/serv_aud/auditorias-service.service';

@Component({
  selector: 'app-auditorias',
  templateUrl: './auditorias.component.html',
  styleUrls: ['./auditorias.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AuditoriasComponent implements OnInit {
  constructor(
    private router: Router,
    private servAuditorias: AuditoriasServiceService
  ) {}

  proyecto: Proyecto = new Proyecto();
  proyectos: Proyecto[] = [];

  desc_proy: Desc_Proyecto = new Desc_Proyecto();
  desc_proyectos: Desc_Proyecto[] = [];

  proceso: Proceso = new Proceso();
  procesos: Proceso[] = [];

  info_proceso: Info_Proceso = new Info_Proceso();
  registros: Info_Proceso[] = [];

  proyectoSeleccionado: string = '';
  descripcionSeleccionado: string = '';
  registroSeleccionado: string = '';
  procesoSeleccionado: number = 0;
  cant_proceso:number = 0;

  list_contenido: string[] = [];
  menu_cont: string[] = [];

  ngOnInit(): void {
    this.listarProyectos();
    this.menu_cont.push('proyecto');
    this.list_contenido.push('id_proyecto');

    if (localStorage.getItem('ced_log') === '') {
      this.router.navigate(['/login']);
    }
  }

  listarProyectos() {
    this.servAuditorias.getProyectos().subscribe((d) => {
      this.proyectos = d;
    });
  }

  crearProyecto() {
    console.log('p ', this.proyecto);
    console.log('ced >> ', localStorage.getItem('ced_log'));
    
    this.servAuditorias.crearProyecto(this.proyecto, localStorage.getItem('ced_log')!).subscribe((data) => {
      console.log('creado ', data);
      this.listarProyectos();
    });
  }

  listarDescripciones(){
    this.servAuditorias
      .getDescByProyecto(this.proyectoSeleccionado)
      .subscribe((d) => {        
        this.desc_proyectos = d;
        console.log('pos ', this.desc_proyectos);
      });
  }

  crearDescProy() {
    if (this.proyectoSeleccionado != '') {
      console.log('desc ', this.desc_proy);
      this.servAuditorias
        .descripcionProyecto(this.desc_proy, this.proyectoSeleccionado)
        .subscribe((d) => {
          console.log('creado -. ', d);
          this.listarDescripciones();
        });
    } else {
      console.log('escoja');
    }
  }

  listarProcesos() {
    this.servAuditorias
      .getProcesoBy(this.descripcionSeleccionado)
      .subscribe((d) => {
        if (d == null) {
          console.log();
        } else {
          this.procesos = d.sort((a, b) => a.proceso - b.proceso);
          this.cant_proceso = this.procesos.length + 1
        }
      });
  }

  crearProceso() {
    this.proceso.proceso = this.cant_proceso
    console.log("guard > ",this.proceso);
    if(this.proceso.estado_contrato != "" && this.proceso.plan_acc != "" && this.proceso.confirmacion_actual != ""){
      if (this.descripcionSeleccionado != '') {
        this.servAuditorias
          .crearProceso(this.descripcionSeleccionado, this.proceso)
          .subscribe((d) => {
            console.log('creado =.', d);
            this.listarProcesos();
          });
        console.log(this.descripcionSeleccionado);
      } else {
        console.log('escoja');
      }
    }
  }

  listarInformacion() {
    this.servAuditorias
      .getInformacionBy(this.descripcionSeleccionado, this.procesoSeleccionado)
      .subscribe((d) => {
        this.registros = d.sort();
      });
  }

  addInformacion() {
    if (
      this.registroSeleccionado != '' &&
      this.info_proceso.arch_inicial != ''
    ) {
      console.log(this.info_proceso);
      this.servAuditorias
        .informacionProceso(
          this.info_proceso,
          this.procesoSeleccionado,
          this.descripcionSeleccionado
        )
        .subscribe((d) => {
          console.log('ccc = ', d);
          this.listarInformacion();
        });
    } else {
      console.log('escoja');
    }
  }

  clickTProyectos(titulo: string) {
    this.proyectoSeleccionado = titulo;
    this.listarDescripciones();
    if (!this.menu_cont.some((s) => s == 'Descripción Proyecto')) {
      this.menu_cont.push('Descripción Proyecto');
      this.list_contenido.push('id_descripcion');
    }
    this.accionDiv('id_descripcion');
  }

  clickTDescripcion(titulo: string) {
    
    console.log('mos ', titulo);
    this.descripcionSeleccionado = titulo;
    this.listarProcesos();
    if (!this.menu_cont.some((s) => s == 'Proceso')) {
      this.menu_cont.push('Proceso');
      this.list_contenido.push('id_proceso');
    }
    this.accionDiv('id_proceso');
  }

  clickTProceso(titulo: string, nproc: number) {
    console.log('proc ', titulo);
    console.log('procn ', nproc);
    this.registroSeleccionado = titulo;
    this.procesoSeleccionado = nproc;
    this.listarInformacion();
    if (!this.menu_cont.some((s) => s == 'Información Procesos')) {
      this.menu_cont.push('Información Procesos');
      this.list_contenido.push('id_info');
    }
    this.accionDiv('id_info');
  }

  cargaArchivo(event: any, estado: string) {
    console.log(event.target.files[0].name);
    estado === 'inicial'
      ? (this.info_proceso.arch_inicial = event.target.files[0].name)
      : (this.info_proceso.arch_final = event.target.files[0].name);
  }

  accionDiv(id: string) {

      var contenido = document.getElementById(id);
      contenido!.style.display = '';
      try {
        var href = document.getElementsByClassName('link_' + id)[0];
        href!.classList.add('href');
      } catch (error) {}
  
      this.list_contenido.forEach((f) => {
        if (f !== id) {
          contenido = document.getElementById(f);
          contenido!.style.display = 'none';
          var href = document.getElementsByClassName('link_' + f)[0];
          href!.classList.remove('href');
        }
      });
  }

  
}
