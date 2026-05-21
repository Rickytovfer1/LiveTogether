import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ChatComponent} from "../chat/chat.component";
import {HeaderVecinoComponent} from "../header-vecino/header-vecino.component";
import {IonicModule, Platform} from "@ionic/angular";
import {ListaVecinosComponent} from "../lista-vecinos/lista-vecinos.component";
import {NotificacionesComponent} from "../notificaciones/notificaciones.component";
import {Vecino} from "../modelos/Vecino";
import {NgOptimizedImage} from "@angular/common";
import {environment} from "../../environments/environment";
import {Comunidad} from "../modelos/Comunidad";
import {Usuario} from "../modelos/Usuario";
import {VecinoUsuarioDTO} from "../modelos/VecinoUsuarioDTO";
import {Router} from "@angular/router";
import {UsuarioService} from "../servicios/usuario-service";
import {VecinoService} from "../servicios/vecino-service";
import {MensajeService} from "../servicios/mensaje-service";
import {jwtDecode} from "jwt-decode";
import {TokenDataDTO} from "../modelos/TokenDataDTO";
import {ComunidadService} from "../servicios/comunidad-service";
import {Vivienda} from "../modelos/Vivienda";

@Component({
    selector: 'app-nav-lateral-derecho-comunidad',
    templateUrl: './nav-lateral-derecho-comunidad.component.html',
    styleUrls: ['./nav-lateral-derecho-comunidad.component.scss'],
    standalone: true,
  imports: [
    IonicModule,
    NgOptimizedImage
  ]
})
export class NavLateralDerechoComunidadComponent  implements OnInit {

  baseUrl: string = environment.apiUrl;

  private usuario!: Usuario
  private comunidad!: Comunidad
  correo!: string
  comunidadObjeto!: Comunidad
  vecino: Vecino = {} as Vecino;
  listaVecinos: VecinoUsuarioDTO[] = []


  constructor(private router: Router,
              private usuarioService: UsuarioService,
              private vecinoService: VecinoService,
              private comunidadService: ComunidadService,) { }

  ngOnInit() {
    this.inicio()
  }

  ionViewWillEnter() {
    this.inicio()
  }

  inicio() {
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
    this.usuarioService.cargarUsuarioComunidad(correo).subscribe({
      next: (usuario: Usuario) => {
        this.usuario = usuario;
        if (this.usuario && this.usuario.id) {
          this.cargarComunidad()
        }
      },
      error: (e) => {
        console.error("Error al cargar el usuario:", e);
      }
    });
  }

  cargarComunidad() {
    if (this.usuario.id) {
      this.comunidadService.cargarComunidadPorIdUsuario(this.usuario.id).subscribe({
        next: data => {
          this.comunidad = data
          this.listarVecinos();
        }
      })
    }
  }

  listarVecinos() {
    if (this.comunidad.id) {
      this.comunidadService.listarVecinosComunidad(this.comunidad.id).subscribe({
        next: data => {
          this.listaVecinos = data.filter(v => v.id !== this.vecino?.id);
          },
        error: err => {
          console.error("Error al listar vecinos:", err);
        }
      });
    }
  }

  getImageUrlVecino(vecino: Vecino): string {
    if (!vecino.fotoPerfil || vecino.fotoPerfil.trim() === '') {
      return 'assets/icon/perfiles/26.png';
    } else if (vecino.fotoPerfil.startsWith('http')) {
      return vecino.fotoPerfil;
    } else {
      return `${this.baseUrl}${vecino.fotoPerfil}`;
    }
  }

}
