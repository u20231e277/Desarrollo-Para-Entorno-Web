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
      this.seleccionadas = this.areas.map(a => a.nombre);
      this.dibujarLineas();
      this.dibujarHistograma();
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
    ctx.font = '12px Arial';
    ctx.fillStyle = '#000';
    for (let i = 0; i < meses; i++) {
      const x = margen + (i * (ancho / (meses - 1)));
      ctx.fillText('M' + (i + 1), x - 10, margen + alto + 15);
    }
    const paso = Math.ceil(max / 5) || 1;
    for (let i = 0; i <= max; i += paso) {
      const y = margen + alto - (i / max) * alto;
      ctx.fillText(i.toString(), margen - 25, y + 3);
    }
    ctx.fillText('Meses', margen + ancho / 2 - 20, margen + alto + 30);
    ctx.save();
    ctx.translate(10, margen + alto / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Reservas', 0, 0);
    ctx.restore();
    const colores = [
      '#e57373', '#64b5f6', '#81c784', '#ffb74d',
      '#9575cd', '#4db6ac', '#f06292', '#aed581'
    ];
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
      ctx.fillStyle = colores[idx % colores.length];
      ctx.fillRect(margen + ancho + 10, margen + idx * 14 - 8, 10, 10);
      ctx.fillStyle = '#000';
      ctx.fillText(nombre, margen + ancho + 25, margen + idx * 14);
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
    ctx.font = '12px Arial';
    ctx.fillStyle = '#000';
    const paso = Math.ceil(max / 5) || 1;
    for (let i = 0; i <= max; i += paso) {
      const y = margen + alto - (i / max) * alto;
      ctx.fillText(i.toString(), margen - 25, y + 3);
    }
    const barWidth = ancho / this.data.areas.length;
    this.data.areas.forEach((a,idx)=>{
      const x = margen + idx * barWidth + barWidth*0.1;
      const y = margen + alto - (this.totalPorArea[a.nombre]/max)*alto;
      const h = (this.totalPorArea[a.nombre]/max)*alto;
      ctx.fillStyle = '#64b5f6';
      ctx.fillRect(x, y, barWidth*0.8, h);
      ctx.save();
      ctx.translate(x + barWidth*0.4, margen + alto + 10);
      ctx.rotate(-Math.PI/4);
      ctx.fillText(a.nombre.substring(0,10), 0, 0);
      ctx.restore();
    });
    ctx.fillText('Áreas', margen + ancho / 2 - 20, margen + alto + 40);
    ctx.save();
    ctx.translate(10, margen + alto / 2);
    ctx.rotate(-Math.PI/2);
    ctx.fillText('Reservas', 0, 0);
    ctx.restore();
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
