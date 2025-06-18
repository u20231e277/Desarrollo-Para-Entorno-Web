import { Component } from '@angular/core';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent {
 areas = [
    { nombre: 'CANCHA 01 - TENIS DE CAMPO', selected: false },
    { nombre: 'CANCHA 02 - TENIS DE CAMPO', selected: false },
    { nombre: 'CANCHA DE FUTBOL 12 PERSONAS', selected: false },
    { nombre: 'CANCHA DE FUTBOL 6 PERSONAS', selected: false },
    { nombre: 'PISCINA DE NATACION PROFESIONAL', selected: false },
    { nombre: 'PISCINA DE RELAJO 2024 - J65', selected: false },
    { nombre: 'CANCHA DE BASKETBALL 2024 RENOVADO', selected: false },
    { nombre: 'CANCHA DE BASKETBALL - 4 INVITADOS MAX', selected: false }
  ];

  toggleSelection(area: any) {
    area.selected = !area.selected;
  }

  getSelectedAreas(): string[] {
    return this.areas.filter(a => a.selected).map(a => a.nombre);
  }
  enviarSeleccion() {
    const seleccionadas = this.getSelectedAreas();
    console.log('Áreas seleccionadas:', seleccionadas);
    // aquí puedes usarlas para enviar al backend, pasarlas a otro componente, etc.
  }
}
