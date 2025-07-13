import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface AreaData { nombre: string; reservaMensual: number[]; }
interface ReservationData { areas: AreaData[]; }

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {

  // -------------------------------------------------------------------------
  // 1. Datos
  // -------------------------------------------------------------------------
  areas: { nombre: string; selected: boolean }[] = [];

  data?: ReservationData;
  seleccionadas: string[] = [];
  totalPorArea: Record<string, number> = {};

  constructor(private http: HttpClient) {}

  // -------------------------------------------------------------------------
  // 2. Helpers de medidas
  // -------------------------------------------------------------------------
  private rotatedBox(w: number, h: number, angle: number) {
    const sin = Math.abs(Math.sin(angle));
    const cos = Math.abs(Math.cos(angle));
    return { w: w * cos + h * sin, h: h * cos + w * sin };
  }

  /** Ajusta width/height internos al tamaño real que pinta el navegador */
  private ajustarCanvas(c: HTMLCanvasElement) {
    const w = c.clientWidth;
    const h = c.clientHeight;   // viene del atributo height del HTML
    if (c.width  !== w) { c.width  = w; }
    if (c.height !== h) { c.height = h; }
  }

  // -------------------------------------------------------------------------
  ngOnInit() {
    const endpoint = 'https://9ceoxvw7mb.execute-api.us-east-1.amazonaws.com/realClubLima/reporte';

    this.http.get<any>(endpoint, {
        params: { meses: 6, soloConfirmada: 1 }
    }).subscribe(res => {

      /* --------- 1. desempaquetar posible wrapper de API Gateway --------- */
      const payload: ReservationData =
        res && res.body ? JSON.parse(res.body) : (res as ReservationData);

      /* --------- 2. guardar datos y construir selector dinámico ---------- */
      this.data  = payload;
      this.areas = this.data.areas.map(a => ({ nombre: a.nombre, selected: false }));

      /* --------- 3. seleccionar todas por defecto y dibujar --------------- */
      this.seleccionadas = this.areas.map(a => a.nombre);

      this.calcularTotales();
      this.dibujarLineas();
      this.dibujarHistograma();
    });
  }

  // -------------------------------------------------------------------------
  // 3. Interfaz de selección
  // -------------------------------------------------------------------------
  toggleSelection(a: any) { a.selected = !a.selected; }
  enviarSeleccion() {
    this.seleccionadas = this.areas.filter(a => a.selected).map(a => a.nombre);
    this.dibujarLineas();
  }

  // -------------------------------------------------------------------------
  // 4. Cálculos auxiliares
  // -------------------------------------------------------------------------
  private calcularTotales() {
    if (!this.data) { return; }
    this.data.areas.forEach(a => {
      this.totalPorArea[a.nombre] = a.reservaMensual.reduce((s, v) => s + v, 0);
    });
  }

  private obtenerMasReservada() {
    return Object.entries(this.totalPorArea)
      .reduce((m, [n, v]) => v > m.v ? { n, v } : m, { n: '', v: -1 }).n;
  }

  // -------------------------------------------------------------------------
  // 5. Gráfico de líneas (reservas mensuales)
  // -------------------------------------------------------------------------
  private dibujarLineas() {
    const canvas = document.getElementById('lineChart') as HTMLCanvasElement;
    if (!canvas || !this.data) { return; }
    this.ajustarCanvas(canvas);                         // (A) ← NUEVO
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = '12px Arial';

    // máximo Y
    const maxY = Math.max(...this.seleccionadas.map(n => {
      const a = this.data!.areas.find(ar => ar.nombre === n);
      return a ? Math.max(...a.reservaMensual) : 0;
    }));

    // leyenda horizontal (cálculo de filas)
    const colores = ['#e57373', '#64b5f6', '#81c784', '#ffb74d',
                     '#9575cd', '#4db6ac', '#f06292', '#aed581'];
    const legendRowH = 16, legendPad = 10;
    let curX = 0, rows = 1;
    this.seleccionadas.forEach(nombre => {
      const w = ctx.measureText(nombre).width + 25;
      if (curX + w > canvas.width - 40) { rows++; curX = 0; }
      curX += w + legendPad;
    });
    const legendH = rows * legendRowH + 5;

    // márgenes
    const yLblW = ctx.measureText(maxY.toString()).width;
    const margin = { top: 20, right: 20, bottom: 40 + legendH, left: yLblW + 20 };
    const plotW = canvas.width - margin.left - margin.right;
    const plotH = canvas.height - margin.top - margin.bottom;

    // ejes
    ctx.beginPath();
    ctx.moveTo(margin.left, margin.top);
    ctx.lineTo(margin.left, margin.top + plotH);
    ctx.lineTo(margin.left + plotW, margin.top + plotH);
    ctx.stroke();

    // ticks X
    const meses = 6;
    for (let i = 0; i < meses; i++) {
      const x = margin.left + (i * plotW / (meses - 1));
      ctx.fillText(`M${i + 1}`, x - 8, margin.top + plotH + 15);
    }
    // ticks Y
    const step = Math.ceil(maxY / 5) || 1;
    for (let v = 0; v <= maxY; v += step) {
      const y = margin.top + plotH - (v / maxY) * plotH;
      ctx.fillText(v.toString(), margin.left - 25, y + 3);
    }
    // etiquetas ejes
    ctx.fillText('Meses', margin.left + plotW / 2 - 18, margin.top + plotH + 30);
    ctx.save();
    ctx.translate(10, margin.top + plotH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Reservas', 0, 10);
    ctx.restore();

    // series
    this.seleccionadas.forEach((nombre, idx) => {
      const a = this.data!.areas.find(ar => ar.nombre === nombre);
      if (!a) { return; }
      ctx.strokeStyle = colores[idx % colores.length];
      ctx.beginPath();
      a.reservaMensual.forEach((v, i) => {
        const x = margin.left + (i * plotW / (meses - 1));
        const y = margin.top + plotH - (v / maxY) * plotH;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      });
      ctx.stroke();
    });

    // leyenda debajo
    let x0 = margin.left, y0 = canvas.height - legendH + 5;
    this.seleccionadas.forEach((nombre, idx) => {
      const txtW = ctx.measureText(nombre).width;
      const blockW = txtW + 25;
      if (x0 + blockW > canvas.width - 20) { x0 = margin.left; y0 += legendRowH; }
      ctx.fillStyle = colores[idx % colores.length];
      ctx.fillRect(x0, y0 - 10, 10, 10);
      ctx.fillStyle = '#000';
      ctx.fillText(nombre, x0 + 15, y0);
      x0 += blockW + legendPad;
    });
  }

  // -------------------------------------------------------------------------
  // 6. Histograma (reservas totales)
  // -------------------------------------------------------------------------
  private dibujarHistograma() {
  const canvas = document.getElementById('histogram') as HTMLCanvasElement;
  if (!canvas || !this.data) { return; }
  this.ajustarCanvas(canvas);
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = '12px Arial';

  // ─── datos básicos ───────────────────────────────────────────────────────
  const maxY = Math.max(...Object.values(this.totalPorArea));
  const yLblW = ctx.measureText(maxY.toString()).width;

  // ahora las etiquetas X son números → no necesitamos rotar
  const margin = { top: 20, right: 20, bottom: 50, left: yLblW + 20 };
  const plotW  = canvas.width  - margin.left - margin.right;
  const plotH  = canvas.height - margin.top  - margin.bottom;

  // ─── ejes ────────────────────────────────────────────────────────────────
  ctx.beginPath();
  ctx.moveTo(margin.left, margin.top);
  ctx.lineTo(margin.left, margin.top + plotH);
  ctx.lineTo(margin.left + plotW, margin.top + plotH);
  ctx.stroke();

  const step = Math.ceil(maxY / 5) || 1;
  for (let v = 0; v <= maxY; v += step) {
    const y = margin.top + plotH - (v / maxY) * plotH;
    ctx.fillText(v.toString(), margin.left - 25, y + 3);
  }

  // ─── barras + número 1…n debajo ─────────────────────────────────────────
  const barW = plotW / this.data.areas.length;
  this.data.areas.forEach((a, idx) => {
    const h = (this.totalPorArea[a.nombre] / maxY) * plotH;
    const x = margin.left + idx * barW + barW * 0.1;
    const y = margin.top  + plotH - h;

    ctx.fillStyle = '#64b5f6';
    ctx.fillRect(x, y, barW * 0.8, h);

    // número bajo cada barra
    ctx.fillStyle = '#000';
    ctx.textAlign = 'center';
    ctx.fillText(String(idx + 1),
                 x + barW * 0.4,
                 margin.top + plotH + 14);
  });

  // títulos ejes
  ctx.fillText('Áreas',
    margin.left + plotW / 2 - 15,
    margin.top + plotH + 34);
  ctx.save(); ctx.translate(10, margin.top + plotH / 2);
  ctx.rotate(-Math.PI / 2); ctx.fillText('Reservas', 0, 10); ctx.restore();

  // ─── leyenda numérica debajo del canvas ──────────────────────────────────
  const xLegend = document.getElementById('xLegend');
  if (xLegend) {
    const lines = this.data.areas.map(
      (a, i) => `${i + 1} : ${a.nombre}`
    ).join('\n');
    xLegend.innerText = lines;
  }

  // aviso “más reservada”
  const aviso = document.getElementById('masReservada');
  if (aviso)
    aviso.innerText = 'Cancha más reservada: ' + this.obtenerMasReservada();
}

}
