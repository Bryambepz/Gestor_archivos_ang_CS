import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { PersonaServiceService } from 'src/app/services/persona-service.service';

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
  }

  login(){
    console.log("em",this.email,"pas",this.password);
    
    this.personaServ.login(this.email, this.password).subscribe((data) => {
      console.log("log ", data);
      if(data){
        this.router.navigate(['/actividades'])
      }else{
        alert("Correo o contraseña incorrectos")
      }
    })
  }
}
