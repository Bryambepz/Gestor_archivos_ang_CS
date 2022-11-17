import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { Actividad_Gen } from 'src/app/domain/Actividad_Gen';
import { ActividadesService } from 'src/app/services/serv_act/actividades.service';

@Component({
  selector: 'app-actividades',
  templateUrl: './actividades.component.html',
  styleUrls: ['./actividades.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ActividadesComponent implements OnInit {
  constructor(private servActividadGen: ActividadesService ,private router: Router) {}

  actividad: Actividad_Gen = new Actividad_Gen();

  fecha: string = "";

  ngOnInit(): void {    
    if(localStorage.getItem('ced_log') == ""){
      this.router.navigate(["/login"])
    }
  }

  crear() {
    this.servActividadGen.crearActividad(this.actividad, localStorage.getItem('ced_log')!).subscribe((data) => {
      console.log(" se ha creado => ", data);
      
    })
    
  }

  calcular_fecha() {

    if(this.actividad.frecuencia != ""){
      
      var fecha_f = this.actividad.fecha_inicio;
      let fecha_split = fecha_f.toLocaleString().split("-",3);
      
      let mes = parseInt(fecha_split[1]) + parseInt(this.actividad.frecuencia);
      let res;
      let year = parseInt(fecha_split[0]);
      if(mes > 12){
        mes = mes - 12;
        year +=1;
      }
      
      this.fecha = year + '-' +(mes >=10 ? mes:'0'+mes) + '-' + fecha_split[2];
      this.actividad.fecha_fin = new Date(this.fecha);

    }else{
      alert("Indique la frecuencia");

    }

    
  }
}
