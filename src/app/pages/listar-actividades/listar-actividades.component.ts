import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Actividad_Gen } from 'src/app/domain/Actividad_Gen';
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

  ngOnInit(): void {
    let ced = localStorage.getItem('ced_log')
    // console.log('logg ', localStorage.getItem('ced_log'));
    if(localStorage.getItem('ced_log') == ""){
      this.router.navigate(["/login"])
    }else{
      this.servActividadesGen.listarActividades(ced!).subscribe((data) => {
        console.log( "acct ", data);
        this.actividades = data;
      })
    }
  }

}
