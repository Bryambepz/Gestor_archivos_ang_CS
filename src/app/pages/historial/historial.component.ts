import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Desc_Proyecto } from 'src/app/domain/Desc_Proyecto';
import { Info_Proceso } from 'src/app/domain/Info_Proceso';
import { Proceso } from 'src/app/domain/Proceso';
import { Proyecto } from 'src/app/domain/Proyecto';
import { AuditoriasServiceService } from 'src/app/services/serv_aud/auditorias-service.service';

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
  
  info_proceso_seleccionado:string[] = [];
  
  constructor(
    private servAuditorias: AuditoriasServiceService,    
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.listarProyectos();
  }

  listarProyectos() {
    this.servAuditorias.getProyectos().subscribe((d) => {
      this.proyectos = d;
    });
  }

  listarInformacion() {
    this.servAuditorias
      .getInformacionBy(this.descripcionSeleccionado, this.procesoSeleccionado)
      .subscribe((d) => {
        this.registros = d;
      });
  }

  clickTProceso(titulo: string, nproc: number) {
    console.log('proc ', titulo);
    console.log('procn ', nproc);
    this.descripcionSeleccionado = titulo;
    this.procesoSeleccionado = nproc;
    this.accionDiv('tbl_info');
    console.log("yeaaaa > ", this.desc_proyectos);
    

    this.listarInformacion();
    // if (!this.menu_cont.some((s) => s == 'Información Procesos')) {
    //   this.menu_cont.push('Información Procesos');
    //   this.list_contenido.push('id_info');
    // }
  }

  clickTHistorial(titulo:string){
    var doc = document.getElementById("id_contenido");
    doc!.style.display='';
    this.proyectoSeleccionado = titulo;
    // console.log(titulo);
    this.desc_proyectos = [];
    this.procesos = [];
    this.registros = [];

    this.servAuditorias.getDescByProyecto(titulo).forEach((d) => {
      this.desc_proyectos=d;
      this.desc_proyectos = this.desc_proyectos.sort((a,b) =>new Date(a.fecha_emision).getTime() - new Date(b.fecha_emision).getTime())
      d.forEach((d2) => {
        this.servAuditorias.getProcesoBy(d2.identificador_desc).forEach((f_d2) => {
          for (let i = 0; i < f_d2.length; i++) {
            f_d2[i].identificador = d2.identificador_desc;            
            this.procesos.push(f_d2[i]);            
          }
          this.procesos = this.procesos.sort((a,b) => b.proceso - a.proceso)
        })
      })
    })      
  }
  
  accionDiv(id:string){
    try {
      var contenido  = document.getElementById(id);
      contenido!.style.display = '';
      
    } catch (error) {
      console.log(error);
      
    }
  }

  chang(opcion:string, id:number, licencia:string):void{
    this.info_proceso_seleccionado = []
    if (opcion == 'edit'){
      // console.log("presiono edit", "id > ", id, " lic > ", licencia);     
      
      this.info_proceso_seleccionado.push(this.proyectoSeleccionado);
      this.info_proceso_seleccionado.push(licencia)
      this.info_proceso_seleccionado.push(id.toString())
      console.log("a guardar", this.info_proceso_seleccionado);
      localStorage.setItem('editarProceso', this.info_proceso_seleccionado.toString())
      this.router.navigate(
        ['/auditorias'],
        { queryParams: {estado:'editarProceso'}}
        );
    }else{
      this.servAuditorias.eliminarProceso(this.proyectoSeleccionado, licencia, id).subscribe((d) => {
        console.log("se elimino? ", d);
        this.clickTHistorial(this.proyectoSeleccionado)
      })
    }

    // this.servAuditorias.accionProceso.subscribe((d) => {
    //   console.log("aaaaaaa ", d);
    //   this.info_proceso_seleccionado=d
    //   console.log(this.info_proceso_seleccionado.length);            
    // })
    // this.servAuditorias.accionProceso.emit(this.info_proceso_seleccionado)
    
  }
}
