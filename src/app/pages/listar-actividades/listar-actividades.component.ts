import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Actividad_Gen } from 'src/app/domain/Actividad_Gen';
import { Registro_Act } from 'src/app/domain/Registro_Act';
import { ActividadesService } from 'src/app/services/serv_act/actividades.service';

@Component({
  selector: 'app-listar-actividades',
  templateUrl: './listar-actividades.component.html',
  styleUrls: ['./listar-actividades.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ListarActividadesComponent implements OnInit {

  constructor(private router: Router, private servActividadesGen:ActividadesService) { }
  actividades: Actividad_Gen[] = [];
  estado:boolean = false;
  registro_act: Registro_Act = new Registro_Act();
  fecha:string[] = new Date().toLocaleDateString().split("/",3);
  vFecha:string = '';
  titulo:string = '';
  
  ngOnInit(): void {
    // console.log("fecha . ", this.fecha[2] + "-" + this.fecha[1] + "-" + this.fecha[0]);
    this.vFecha = this.fecha[2] + "-" + this.fecha[1] + "-" + this.fecha[0];
    let ced = localStorage.getItem('ced_log')
    if(localStorage.getItem('ced_log') == ""){
      this.router.navigate(["/login"])
    }else{
      this.servActividadesGen.listarActividades(ced!).subscribe((data) => {
        this.actividades = data;

      })
    }
  }

  guardar_registro(){
    if(this.titulo != ''){
      this.registro_act.estado = true;
      console.log("reg > ", this.registro_act , '\n v-> ', this.titulo);
      this.servActividadesGen.registroActividad(this.registro_act,this.titulo).subscribe((data) => {
        console.log("gua ",data);
      })
    }else{
      alert("Indique aque actividad agregará este registro")
    }
    
  }
  click_tabla(v:string){
    this.titulo = v;
  }
}
