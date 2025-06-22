import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportComponent } from './pages/report/report.component';
import { InicioComponent } from './pages/inicio/inicio.component';
import { ConfirmComponent } from './pages/confirm/confirm.component';
import { ConfirmacionComponent } from './pages/confirmacion/confirmacion.component';

const routes: Routes = [
  { path: "", redirectTo: "inicio", pathMatch: "full"},
  { path: 'inicio', component: InicioComponent },
  { path: 'report', component: ReportComponent },
  { path: 'confirm', component: ConfirmComponent },
  { path: 'confirmacion', component: ConfirmacionComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
