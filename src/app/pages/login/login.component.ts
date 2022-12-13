import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { PersonaServiceService } from 'src/app/services/serv_per/persona-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit {
  
  email:string = "";
  password:string = "";

  constructor(private personaServ: PersonaServiceService, private router: Router) { }

  ngOnInit(): void {
    localStorage.setItem('ced_log', "")
  }

  login(){
    console.log("em",this.email,"pas",this.password);
    
    this.personaServ.login(this.email, this.password).subscribe((data) => {
      console.log("log ", data.cedula);
      if(data){
        localStorage.setItem('ced_log', data.cedula)
        // this.router.navigate(['/actividad']).then(() => window.location.reload())
        window.location.href = "/auditorias"
      }else{
        alert("Correo o contraseña incorrectos")
      }
    })
  }

}
