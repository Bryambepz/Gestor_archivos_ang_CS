import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Persona } from 'src/app/domain/Persona';
import { PersonaServiceService } from 'src/app/services/serv_per/persona-service.service';

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.component.html',
  styleUrls: ['./registrar.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class RegistrarComponent implements OnInit {
  new_persona: Persona = new Persona();
  conf_pass: string = '';

  // roles: string[] = ['SuperAdmmin', 'Administrador', 'Usuario'];
  cargo: string[] = ['Jefe Departamento', 'Jefe Area', 'Otro'];
  
  constructor(private personaServ: PersonaServiceService, private route:Router) {}

  ngOnInit(): void {}

  validar = async () => {
    try {
      if (this.conf_pass != this.new_persona.contrasenia) {
        var inputPass = document.getElementById("password");
        inputPass!.className = "icon";

      } else if (this.conf_pass == this.new_persona.contrasenia) {
        var inputPass = document.getElementById("password");
        inputPass!.classList.remove("icon");
      }
    } catch (error) {
      alert('Something went wrong, try again later!')
    }
  };

  registrar() {
    console.log("json => ", this.new_persona);
    
    this.personaServ.registrar(this.new_persona).subscribe((data) => {
      console.log("la per => ",data);
      
      if(data != null){
        this.route.navigate(['/Login'])
      }
    })
  }
}
