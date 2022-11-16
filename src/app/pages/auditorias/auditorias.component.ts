import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs';
import { Desc_Proyecto } from 'src/app/domain/Desc_Proyecto';
import { Proyecto } from 'src/app/domain/Proyecto';
import { AuditoriasServiceService } from 'src/app/services/serv_aud/auditorias-service.service';

@Component({
  selector: 'app-auditorias',
  templateUrl: './auditorias.component.html',
  styleUrls: ['./auditorias.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AuditoriasComponent implements OnInit {

  constructor(private servAuditorias: AuditoriasServiceService) { }

  proyecto:Proyecto = new Proyecto();
  proyectos: Proyecto[] = [];
  desc_proy:Desc_Proyecto = new Desc_Proyecto();
  mostrar:boolean = false;

  ngOnInit(): void {
    this.listarProyectos();
  }
  
  listarProyectos(){
    this.servAuditorias.getProyectos().subscribe((d) => {
      console.log(d);
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

  clickTProyectos(){
    if(!this.mostrar){
      this.mostrar = true
    }else{
      this.mostrar = false
    }
    console.log('mos ', this.mostrar);
  }
}
