import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportComponent } from './pages/report/report.component';
import { InicioComponent } from './pages/inicio/inicio.component';

const routes: Routes = [
  { path: "", redirectTo: "inicio", pathMatch: "full"},
  { path: 'inicio', component: InicioComponent },
  { path: 'report', component: ReportComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
