import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-listar-actividades',
  templateUrl: './listar-actividades.component.html',
  styleUrls: ['./listar-actividades.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ListarActividadesComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
    // console.log('logg ', login.cedulaLog);
    // if(login.cedulaLog == ""){
    //   this.router.navigate(["/login"])
    // }
  }

}
