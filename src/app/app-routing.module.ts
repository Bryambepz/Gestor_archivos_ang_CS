import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActividadesComponent } from './pages/actividades/actividades.component';
import { AuditoriasComponent } from './pages/auditorias/auditorias.component';
import { ListarActividadesComponent } from './pages/listar-actividades/listar-actividades.component';
import { LoginComponent } from './pages/login/login.component';
import { RegistrarComponent } from './pages/registrar/registrar.component';

const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'registrar', component: RegistrarComponent},
  {path: 'actividad', component: ActividadesComponent},
  {path: 'Listar', component: ListarActividadesComponent},
  {path: 'auditorias', component: AuditoriasComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
