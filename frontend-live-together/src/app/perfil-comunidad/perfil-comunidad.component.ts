import { Component, OnInit } from '@angular/core';
import {HeaderComponent} from "../header/header.component";
import {IonicModule, Platform} from "@ionic/angular";
import {NavLateralVecinoComponent} from "../nav-lateral-vecino/nav-lateral-vecino.component";
import {FooterVecinoComponent} from "../footer-vecino/footer-vecino.component";
import {NgOptimizedImage} from "@angular/common";
import {VecinoService} from "../servicios/vecino-service";
import {UsuarioService} from "../servicios/usuario-service";
import {environment} from "../../environments/environment";
import {Usuario} from "../modelos/Usuario";
import {Vecino} from "../modelos/Vecino";
import {Comunidad} from "../modelos/Comunidad";
import {Router} from "@angular/router";
import {TokenDataDTO} from "../modelos/TokenDataDTO";
import {jwtDecode} from "jwt-decode";
import {HeaderVecinoComponent} from "../header-vecino/header-vecino.component";
import {NavLateralDerechoVecinoComponent} from "../nav-lateral-derecho-vecino/nav-lateral-derecho-vecino.component";

@Component({
  selector: 'app-perfil-comunidad',
  templateUrl: './perfil-comunidad.component.html',
  styleUrls: ['./perfil-comunidad.component.scss'],
  standalone: true,
  imports: [
    HeaderComponent,
    IonicModule,
    NavLateralVecinoComponent,
    FooterVecinoComponent,
    NgOptimizedImage,
    HeaderVecinoComponent,
    NavLateralDerechoVecinoComponent
  ]
})
export class PerfilComunidadComponent  implements OnInit {
  isDesktop: boolean = false;
  baseUrl: string = environment.apiUrl;

  private usuario?: Usuario
  vecino?: Vecino
  propietario?: Vecino;
  vecinoFoto: Vecino = {} as Vecino;

  private correo!: string
  private comunidad!: Comunidad

  constructor(
    private router: Router,
    private usuarioService: UsuarioService,
    private vecinoService: VecinoService,
    private platform: Platform
  ) {}

  ngOnInit() {
    this.isDesktop = this.platform.width() >= 992;

  }

  ionViewWillEnter() {
    this.inicio();
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
          this.cargarComunidad()
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
      error: () => {
        console.log('Ocurrió un error al cargar los datos.', 'danger');
      }
    });
  }

  cargarVecino() {
    if (this.usuario) {
      this.vecinoService.cargarVecinoPorIdUsuario(this.usuario.id).subscribe({
        next: data => {
          this.vecino = data
          this.vecinoFoto = data
          this.cargarComunidad()
        }
      });
    }
  }

  cargarComunidad() {
    const comunidadStorage = sessionStorage.getItem('comunidad');
    if (comunidadStorage) {
      this.comunidad = JSON.parse(comunidadStorage);
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
