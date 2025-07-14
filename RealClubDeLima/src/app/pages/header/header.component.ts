import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  @ViewChild('menuIcon') menuIcon!: ElementRef;
  @ViewChild('nav') nav!: ElementRef;

  sesionActiva: boolean = false;
   isAdmin: boolean = false;
  isSocio: boolean = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Verifica si hay un usuario guardado
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    this.sesionActiva = !!usuario;

     if (usuario.codigo === '0001') {
      this.isAdmin = true;
    }
  }

  toggleNav(open: boolean): void {
    const navEl = this.nav.nativeElement;
    const menuIconEl = this.menuIcon.nativeElement;

    if (open) {
      navEl.classList.add('active');
      menuIconEl.style.display = 'none';
    } else {
      navEl.classList.remove('active');
      menuIconEl.style.display = 'block';
    }
  }

  cerrarSesion(): void {
    // Limpia la sesión
    localStorage.removeItem('usuario');
    this.sesionActiva = false; // Oculta botón
    this.isAdmin = false;      
  this.isSocio = false; 
    this.router.navigate(['/inicio']); // Redirige al login
    
  }
}
