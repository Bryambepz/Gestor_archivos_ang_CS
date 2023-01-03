import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { PersonaServiceService } from 'src/app/services/serv_per/persona-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';

  constructor(
    private personaServ: PersonaServiceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    localStorage.setItem('ced_log', '');
    this.email = '';
    this.password = '';
  }

  login() {
    if (this.email != '' && this.password != '') {
      this.hash(this.password).then((th) => {
        let pass = th;
        this.personaServ.login(this.email, pass).subscribe((data) => {
          console.log('log ', data);
          if (data) {
            localStorage.setItem('ced_log', data.cedula);
            // this.router.navigate(['/actividad']).then(() => window.location.reload())
            this.email = '';
            this.password = '';
            Swal.fire({ title: 'Verificando...' });
            Swal.showLoading(null);
            setTimeout(() => {
                Swal.fire({ title: 'Login Correcto', icon: 'success',showConfirmButton: false, timer:1000 }).then((th) => 
                  window.location.href = '/control_auditoria'
              );
            }, 1500);

          } else {
            // alert("Correo o contraseña incorrectos")
            Swal.fire({
              position: 'center',
              icon: 'warning',
              title: 'Correo o contraseña incorrectos',
              showConfirmButton: false,
              timer: 1500,
            });
          }
        });
      });
    } else {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Hay campos vacios',
        showConfirmButton: false,
        timer: 1500,
      });
    }
  }

  async hash(string: string) {
    const utf8 = new TextEncoder().encode(string);
    const hashBuffer = await crypto.subtle.digest('SHA-256', utf8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((bytes) => bytes.toString(16).padStart(2, '0'))
      .join('');
    return hashHex;
  }
}
