import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  codigo: string = '';
  password: string = '';
  isLoading: boolean = false;
  loginFallido: boolean = false;
   mensajeError: string = '';

  constructor(private router: Router, private us: UsuarioService) {}

  ngOnInit(): void {
    // Si ya hay sesión, redirigir automáticamente
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      this.router.navigate(['/home']);
    }
  }

  login(event: Event): void {
  event.preventDefault();
  this.isLoading = true;

  this.us.__be_postvalidarUsuario(this.codigo, this.password).subscribe({
    next: (response) => {
      this.isLoading = false;

      // Obtener datos de la respuesta
      const data = typeof response.body === 'string' ? JSON.parse(response.body) : response.body;

      console.log('API Response:', data);

      if (data.validado) {
        // Guardar usuario en localStorage (para mantener sesión)
        localStorage.setItem('usuario', JSON.stringify(data.usuario));

        // Redirigir al home
        //this.router.navigate(['/home']);
        window.location.href = '/home';
      } else {
        // Mostrar modal de error
        this.mostrarError('Usuario o contraseña incorrectos');
      }
    },
    error: (error) => {
      this.isLoading = false;
      console.error(' Error API', error);
      this.mostrarError('Error al conectar con el servidor');
    }
  });
}


  mostrarError(mensaje: string): void {
    this.mensajeError = mensaje;
    this.loginFallido = true;

    // Mostrar modal de error
    const modal = document.getElementById('errorModal') as HTMLDialogElement;
    modal?.showModal();

    // Cerrar automáticamente después de 2.5s
    setTimeout(() => modal?.close(), 2500);
  }

  cerrarModal(): void {
    const modal = document.getElementById('loginModal') as HTMLDialogElement;
    if (modal) modal.close();
  }
}
