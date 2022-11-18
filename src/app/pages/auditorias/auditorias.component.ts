import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Desc_Proyecto } from 'src/app/domain/Desc_Proyecto';
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

  proyectoSeleccionado:string = '';
  procesoSeleccionado:string = '';
  mostrar:boolean = false;

  // date:Date = new Date();
  ngOnInit(): void {
    // let year = this.date.getFullYear();
    // let month = this.date.getMonth() + 1;
    // let day = this.date.getDate();
    this.listarProyectos();
    this.listarDescripciones();

    // document.getElementsByName("fecha_ini")[0].innerHTML = year + '-' + month + '-' + day;
    if(localStorage.getItem('ced_log') == ""){
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
    this.servAuditorias.getDescripciones().subscribe((d) => this.desc_proyectos = d);
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

  crearProceso(){
    if(this.procesoSeleccionado != ''){
      console.log(this.procesoSeleccionado);
      this.servAuditorias.crearProceso(this.procesoSeleccionado, this.proceso).subscribe((d) => console.log('creado =.', d));
    }else{
      console.log('escoja');
      
    }
  }

  clickTProyectos(titulo:string){
    if(!this.mostrar){
      this.mostrar = true
    }else{
      this.mostrar = false
    }
    this.proyectoSeleccionado = titulo;
    // console.log('mos ', this.mostrar, " -- ", titulo);
  }
  
  clickTProcesos(titulo:string){
    if(!this.mostrar){
      this.mostrar = true
    }else{
      this.mostrar = false
    }
    this.procesoSeleccionado = titulo;
    // console.log('mos ', titulo);
  }
}
