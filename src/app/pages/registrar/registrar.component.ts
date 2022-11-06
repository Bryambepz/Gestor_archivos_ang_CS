import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Persona } from 'src/app/domain/Persona';
import { PersonaServiceService } from 'src/app/services/persona-service.service';

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.component.html',
  styleUrls: ['./registrar.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class RegistrarComponent implements OnInit {
  new_persona: Persona = new Persona();
  conf_pass: string = '';

  roles: string[] = ['SuperAdmmin', 'Administrador', 'Usuario'];
  Profesion: string[] = ['Lic. Contabilidad', 'Ing. Ambiental', 'Ing. Civil'];

  constructor(private personaServ: PersonaServiceService) {}

  ngOnInit(): void {
  }

  validar = async () => {
    try {
      if (this.conf_pass != this.new_persona.password) {
        var inputPass = document.getElementById("password");
        inputPass!.className = "icon";

      } else if (this.conf_pass == this.new_persona.password) {
        var inputPass = document.getElementById("password");
        inputPass!.classList.remove("icon");
      }
    } catch (error) {
      alert('Something went wrong, try again later!')
    }
  };

  registrar() {
    // console.log('Persona Reg => ', JSON.stringify(this.new_persona));
    // var fecha = this.new_persona.fecha_nac.toDateString();
    // this.new_persona.fecha_nac = this.datepipe.transform(this.new_persona.fecha_nac, 'dd-MM-yyyy');
    console.log("json => ", this.new_persona);
    
    this.personaServ.registrar(this.new_persona).subscribe((data) => {
      console.log("la per => ",data);
      
    })
  }
}
