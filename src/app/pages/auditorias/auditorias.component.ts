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

  constructor(private router:Router,private servAuditorias: AuditoriasServiceService) { }

  proyecto:Proyecto = new Proyecto();
  proyectos: Proyecto[] = [];

  desc_proy:Desc_Proyecto = new Desc_Proyecto();
  desc_proyectos:Desc_Proyecto[] = [];

  proceso: Proceso = new Proceso();
  procesos: Proceso[] = [];

  info_proceso: Info_Proceso = new Info_Proceso();
  registros: Info_Proceso[] = [];
  

  proyectoSeleccionado:string = '';
  descripcionSeleccionado:string = '';
  registroSeleccionado:string = '';
  procesoSeleccionado:number = 0;

  list_contenido: string[] = ['id_proyecto', 'id_descripcion', 'id_proceso', 'id_info'];
  menu_cont: string[] = [];

  mostrar:boolean = false;

  ngOnInit(): void {    
    this.listarProyectos();
    this.listarDescripciones();
    this.listarProcesos();    
    this.menu_cont.push('proyecto')
    
    if(localStorage.getItem('ced_log') === "" ){
      this.router.navigate(["/login"])
    }
  }
  
  listarProyectos(){
    this.servAuditorias.getProyectos().subscribe((d) => {
      this.proyectos = d;
    })    
  }

  crearProyecto(){
    console.log('p ', this.proyecto);
    this.servAuditorias.crearProyecto(this.proyecto).subscribe((data) => {
      console.log("creado ", data);      
      this.listarProyectos();
    })
  }  

  listarDescripciones(){
    this.servAuditorias.getDescByProyecto(this.proyectoSeleccionado).subscribe((d) => {
      this.desc_proyectos = d
    })
  }

  crearDescProy(){
    if(this.proyectoSeleccionado != ''){
      console.log('desc ', this.desc_proy);
      this.servAuditorias.descripcionProyecto(this.desc_proy, this.proyectoSeleccionado).subscribe((d) => {
        console.log('creado -. ', d);        
        this.listarDescripciones();
      }) 
    }else{
      console.log('escoja');      
    }
  }

  listarProcesos(){
    this.servAuditorias.getProcesoBy(this.descripcionSeleccionado).subscribe((d) => {
      this.procesos = d.sort((a, b) => a.proceso - b.proceso);
    })
  }

  crearProceso(){
    if(this.descripcionSeleccionado != ''){      
      this.servAuditorias.crearProceso(this.descripcionSeleccionado, this.proceso).subscribe((d) => {
        console.log('creado =.', d)
        this.listarProcesos();
      });
      console.log(this.descripcionSeleccionado);
    }else{
      console.log('escoja');
    }
  }

  listarInformacion(){
    this.servAuditorias.getInformacionBy(this.descripcionSeleccionado, this.procesoSeleccionado).subscribe((d) =>{
      this.registros = d.sort()
    })
  }

  addInformacion(){
    if(this.registroSeleccionado != '' && this.info_proceso.ubi_archivo != ''){
      console.log(this.info_proceso);
      this.servAuditorias.informacionProceso(this.info_proceso, this.procesoSeleccionado ,this.descripcionSeleccionado).subscribe((d) => {
        console.log('ccc = ',d);
        this.listarInformacion()  
      })
    }else{
      console.log('escoja');
      
    }
  }
  
  clickTProyectos(titulo:string){
    if(!this.mostrar){
      // console.log('mos ', this.mostrar, " -- ", titulo);
      this.mostrar = true
    }else{
      this.mostrar = false
    }
    this.proyectoSeleccionado = titulo;
    this.listarDescripciones();
    this.menu_cont.push('Descripción Proyecto')
    this.accionDiv('id_descripcion')
  }
  
  clickTDescripcion(titulo:string){
    if(!this.mostrar){
      this.mostrar = true
    }else{
      this.mostrar = false
    }
    // this.registroSeleccionado = titulo;
    console.log('mos ', titulo);
    this.descripcionSeleccionado = titulo;
    this.listarProcesos();    
    this.menu_cont.push('Proceso')
    this.accionDiv('id_proceso');
  }

  clickTProceso(titulo:string, nproc:number){
    console.log('proc ', titulo);
    console.log('procn ', nproc);
    this.registroSeleccionado = titulo;
    this.procesoSeleccionado = nproc;
    this.listarInformacion();
    this.menu_cont.push('Información Procesos')
    this.accionDiv('id_info')
  }

  cargaArchivo(event:any){
    console.log(event.target.files[0].name);
    this.info_proceso.ubi_archivo = event.target.files[0].name
  }

  accionDiv(id:string){   
    console.log(id);
    var contenido = document.getElementById(id);
    contenido!.style.display = '';

    this.list_contenido.forEach((f) => {
      if(f !== id){
        contenido = document.getElementById(f)
        contenido!.style.display = 'none'
      }
    })
  }

  // accionHref(id:string){
  //   id = 'id_'+id;
  // }
}
