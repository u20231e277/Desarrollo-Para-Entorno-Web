import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './pages/header/header.component';
import { ReportComponent } from './pages/report/report.component';
import { InicioComponent } from './pages/inicio/inicio.component';
import { ConfirmComponent } from './pages/confirm/confirm.component';
import { ConfirmacionComponent } from './pages/confirmacion/confirmacion.component';
import { CreditComponent } from './pages/credit/credit.component';
import { LoginComponent } from './pages/login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ReportComponent,
    InicioComponent,
    ConfirmComponent,
    ConfirmacionComponent,
    CreditComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
