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
import { FullCalendarModule } from '@fullcalendar/angular';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './pages/home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { FooterComponent } from './pages/footer/footer.component';
import { CommonModule } from '@angular/common';
import { Reserva2Component } from './pages/reserva2/reserva2.component';
import { ReservaComponent } from './pages/reserva/reserva.component';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ReportComponent,
    InicioComponent,
    ConfirmComponent,
    ConfirmacionComponent,
    CreditComponent,
    HomeComponent,
    FooterComponent,
    Reserva2Component,
    ReservaComponent
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FullCalendarModule,
    FormsModule,
    BrowserAnimationsModule,
     MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    CommonModule ,
    RouterModule    
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
