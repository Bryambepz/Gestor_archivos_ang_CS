import { Component, OnInit } from '@angular/core';
import { Persona } from 'src/app/domain/Persona';
import { PersonaServiceService } from 'src/app/services/serv_per/persona-service.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  constructor(private servPersona:PersonaServiceService) { }
  persona:Persona = new Persona();
  adminRol:boolean = false;
  ngOnInit(): void {
    this.servPersona.getPersonas().subscribe((d) => {
      d.forEach(f => {        
        this.persona = (f.cedula == localStorage.getItem('ced_log'))? f:new Persona();
      })

      if(this.persona.rol == 'Administrador'){
        this.adminRol = true;
      }
    })
  }

}
