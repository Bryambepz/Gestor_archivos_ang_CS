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
  // password: string = '';

  cargo: string[] = ['Jefe Departamental', 'Ingeniero Ambiental'];
  
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
    if(this.new_persona.cargo != ""){
      this.hash(this.new_persona.contrasenia).then((th) => {        
        let p = this.new_persona;
        p.contrasenia = th

        this.personaServ.registrar(p).subscribe((data) => {
          console.log("la per => ",data);
          
          if(data != null){
          this.new_persona = new Persona();          
            this.route.navigate(['/login'])
          }
        })
  
      })
    }
  }
  
  async hash(string:string) {
    const utf8 = new TextEncoder().encode(string);
    const hashBuffer = await crypto.subtle.digest('SHA-256', utf8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((bytes) => bytes.toString(16).padStart(2, '0'))
      .join('');
    return hashHex;
  }
}
