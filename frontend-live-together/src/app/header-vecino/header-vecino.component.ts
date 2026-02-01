import {Component, EventEmitter, HostListener, OnInit, Output} from '@angular/core';
import {IonicModule, Platform} from "@ionic/angular";
import {jwtDecode} from "jwt-decode";
import {TokenDataDTO} from "../modelos/TokenDataDTO";
import {Usuario} from "../modelos/Usuario";
import {Comunidad} from "../modelos/Comunidad";
import {Vecino} from "../modelos/Vecino";
import {filter, Subscription} from "rxjs";
import {NavigationEnd, Router} from "@angular/router";
import {UsuarioService} from "../servicios/usuario-service";
import {VecinoService} from "../servicios/vecino-service";

@Component({
  selector: 'app-header-vecino',
  templateUrl: './header-vecino.component.html',
  styleUrls: ['./header-vecino.component.scss'],
  standalone: true,
  imports: [
    IonicModule
  ]
})
export class HeaderVecinoComponent  implements OnInit {
  isDesktop = false;

  notificacionesPendientes = 0
  correo: string = ""
  usuario: Usuario = {} as Usuario
  comunidadObjeto!: Comunidad
  vecino!: Vecino;
  private routerSubscription!: Subscription;

  @Output() notificacionesClicked = new EventEmitter<void>();
  @Output() chatClicked = new EventEmitter<void>();

  constructor(private router: Router,
              private usuarioService: UsuarioService,
              private vecinoService: VecinoService,
              private platform: Platform) {
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {})
  }

  ngOnInit() {
    this.checkDesktop();
    this.inicio()
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkDesktop();
  }

  checkDesktop() {
    this.isDesktop = window.innerWidth >= 992; // o platform.width() si prefieres
  }

  inicio() {
    const comunidad = sessionStorage.getItem('comunidad');
    if (comunidad) {
      this.comunidadObjeto = JSON.parse(comunidad);
    }

    const token = sessionStorage.getItem('authToken');
    if (token) {
      try {
        const decodedToken = jwtDecode<{ tokenDataDTO: TokenDataDTO }>(token);
        const tokenDataDTO = decodedToken?.tokenDataDTO;
        if (tokenDataDTO && tokenDataDTO.correo) {
          this.correo = tokenDataDTO.correo;
          this.cargarUsuario(this.correo);
        }
      } catch (e) {
        console.error('Error al decodificar el token:', e);
      }
    } else {
      this.router.navigate(['/']);
    }
  }

  cargarUsuario(correo: string): void {
    this.usuarioService.cargarUsuario(correo).subscribe({
      next: (usuario: Usuario) => {
        this.usuario = usuario;
        if (this.usuario && this.usuario.id) {
          this.cargarVecino();
        }
      },
      error: (e) => {
        console.error("Error al cargar el usuario:", e);
      }
    });
  }

  cargarVecino(): void {
    if (this.usuario.id) {
      this.vecinoService.cargarVecinoPorIdUsuario(this.usuario.id).subscribe({
        next: data => {
          this.vecino = data;

        }
      });
    }
  }


  navigateToComunidades() {
    sessionStorage.removeItem('comunidad');
    this.router.navigate(['/comunidades']);
  }

  navigateToChat() {
    if (this.isDesktop) {
      this.chatClicked.emit();
    } else {
      this.router.navigate(['/lista-vecinos']);
    }
  }


  navigateToNotificaciones() {
    if (this.isDesktop) {
      this.notificacionesClicked.emit();
    } else {
      this.router.navigate(['/notificaciones']);
    }
  }


}
