import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-actividades',
  templateUrl: './actividades.component.html',
  styleUrls: ['./actividades.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ActividadesComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  crear(){
    this.router.navigate(["Listar"]);
  }
}
