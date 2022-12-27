import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegistrarComponent } from './pages/registrar/registrar.component';
import { LoginComponent } from './pages/login/login.component';
import { ActividadesComponent } from './pages/actividades/actividades.component';
import { ListarActividadesComponent } from './pages/listar-actividades/listar-actividades.component';
import { AuditoriasComponent } from './pages/auditorias/auditorias.component';
import { HistorialComponent } from './pages/historial/historial.component';
import { MenuComponent } from './pages/menu/menu.component';
// import { HistorialComponent } from './page/historial/historial.component';

@NgModule({
  declarations: [
    AppComponent,
    RegistrarComponent,
    LoginComponent,
    ActividadesComponent,
    ListarActividadesComponent,
    AuditoriasComponent,
    HistorialComponent,
    MenuComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
