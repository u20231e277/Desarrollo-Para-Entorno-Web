import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportComponent } from './pages/report/report.component';
import { InicioComponent } from './pages/inicio/inicio.component';
import { LoginComponent } from './pages/login/login.component';
import { ConfirmComponent } from './pages/confirm/confirm.component';
import { ConfirmacionComponent } from './pages/confirmacion/confirmacion.component';
import { CreditComponent } from './pages/credit/credit.component';
import { HomeComponent } from './pages/home/home.component';
import { Reserva2Component } from './pages/reserva2/reserva2.component';

const routes: Routes = [
  { path: "", redirectTo: "inicio", pathMatch: "full"},
  { path: 'inicio', component: InicioComponent },
  { path: 'login', component: LoginComponent },
  { path: 'report', component: ReportComponent },
  { path: 'confirm', component: ConfirmComponent },
  { path: 'confirmacion', component: ConfirmacionComponent },
  { path: 'credit', component: CreditComponent },
  { path: 'home', component: HomeComponent },
  {path: 'login', component: LoginComponent},
  {path: 'reserva2', component: Reserva2Component}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
