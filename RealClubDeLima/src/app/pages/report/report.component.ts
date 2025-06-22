import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface AreaData {
  nombre: string;
  reservaMensual: number[];
}

interface ReservationData {
  areas: AreaData[];
}

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
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

  data: ReservationData | undefined;
  seleccionadas: string[] = [];
  totalPorArea: { [key: string]: number } = {};

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<ReservationData>('assets/data/reservations.json').subscribe(d => {
      this.data = d;
      this.calcularTotales();
    });
  }

  toggleSelection(area: any) {
    area.selected = !area.selected;
  }

  getSelectedAreas(): string[] {
    return this.areas.filter(a => a.selected).map(a => a.nombre);
  }
  enviarSeleccion() {
    this.seleccionadas = this.getSelectedAreas();
    this.dibujarLineas();
    this.dibujarHistograma();
  }

  calcularTotales() {
    if (!this.data) { return; }
    this.data.areas.forEach(a => {
      this.totalPorArea[a.nombre] = a.reservaMensual.reduce((s,v)=>s+v,0);
    });
  }

  dibujarLineas() {
    const canvas = document.getElementById('lineChart') as HTMLCanvasElement;
    if (!canvas || !this.data) { return; }
    const ctx = canvas.getContext('2d');
    if (!ctx) { return; }
    ctx.clearRect(0,0,canvas.width,canvas.height);
    const meses = 6;
    const margen = 30;
    const ancho = canvas.width - margen*2;
    const alto = canvas.height - margen*2;
    const max = Math.max(...this.seleccionadas.map(n => {
      const a = this.data!.areas.find(ar=>ar.nombre===n);
      return a ? Math.max(...a.reservaMensual) : 0;
    }));
    ctx.strokeStyle = '#000';
    ctx.beginPath();
    ctx.moveTo(margen, margen);
    ctx.lineTo(margen, margen+alto);
    ctx.lineTo(margen+ancho, margen+alto);
    ctx.stroke();
    const colores = ['#e57373','#64b5f6','#81c784','#ffb74d','#9575cd','#4db6ac'];
    this.seleccionadas.forEach((nombre, idx) => {
      const area = this.data!.areas.find(a=>a.nombre===nombre);
      if (!area) { return; }
      ctx.strokeStyle = colores[idx % colores.length];
      ctx.beginPath();
      area.reservaMensual.forEach((v,i)=>{
        const x = margen + (i*(ancho/(meses-1)));
        const y = margen + alto - (v/max)*alto;
        if (i===0) { ctx.moveTo(x,y);} else { ctx.lineTo(x,y); }
      });
      ctx.stroke();
    });
  }

  dibujarHistograma() {
    const canvas = document.getElementById('histogram') as HTMLCanvasElement;
    if (!canvas || !this.data) { return; }
    const ctx = canvas.getContext('2d');
    if (!ctx) { return; }
    ctx.clearRect(0,0,canvas.width,canvas.height);
    const margen = 30;
    const ancho = canvas.width - margen*2;
    const alto = canvas.height - margen*2;
    const max = Math.max(...Object.values(this.totalPorArea));
    ctx.strokeStyle = '#000';
    ctx.beginPath();
    ctx.moveTo(margen, margen);
    ctx.lineTo(margen, margen+alto);
    ctx.lineTo(margen+ancho, margen+alto);
    ctx.stroke();
    const barWidth = ancho / this.data.areas.length;
    this.data.areas.forEach((a,idx)=>{
      const x = margen + idx * barWidth + barWidth*0.1;
      const y = margen + alto - (this.totalPorArea[a.nombre]/max)*alto;
      const h = (this.totalPorArea[a.nombre]/max)*alto;
      ctx.fillStyle = '#64b5f6';
      ctx.fillRect(x, y, barWidth*0.8, h);
    });
    const mas = this.obtenerMasReservada();
    const aviso = document.getElementById('masReservada');
    if (aviso) { aviso.innerText = 'Cancha más reservada: ' + mas; }
  }

  obtenerMasReservada(): string {
    let max = 0;
    let nombre = '';
    for (const n in this.totalPorArea) {
      if (this.totalPorArea[n] > max) {
        max = this.totalPorArea[n];
        nombre = n;
      }
    }
    return nombre;
  }
}
