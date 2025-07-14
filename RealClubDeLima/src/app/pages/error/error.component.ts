import { Component } from '@angular/core';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent {
  date: string = '';
  constructor() {
    this.date = new Date().toLocaleDateString('es-ES');
  }

}
