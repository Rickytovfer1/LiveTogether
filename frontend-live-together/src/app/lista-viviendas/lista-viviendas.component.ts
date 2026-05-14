import { Component, OnInit } from '@angular/core';
import {FooterVecinoComponent} from "../footer-vecino/footer-vecino.component";
import {HeaderComponent} from "../header/header.component";
import {HeaderVecinoComponent} from "../header-vecino/header-vecino.component";
import {IonicModule} from "@ionic/angular";
import {NavLateralDerechoVecinoComponent} from "../nav-lateral-derecho-vecino/nav-lateral-derecho-vecino.component";
import {NavLateralVecinoComponent} from "../nav-lateral-vecino/nav-lateral-vecino.component";
import {NgOptimizedImage} from "@angular/common";
import {NavLateralComunidadComponent} from "../nav-lateral-comunidad/nav-lateral-comunidad.component";
import {FooterComunidadComponent} from "../footer-comunidad/footer-comunidad.component";
import {Usuario} from "../modelos/Usuario";
import {Comunidad} from "../modelos/Comunidad";
import {Router} from "@angular/router";
import {UsuarioService} from "../servicios/usuario-service";
import {ComunidadService} from "../servicios/comunidad-service";
import {jwtDecode} from "jwt-decode";
import {TokenDataDTO} from "../modelos/TokenDataDTO";
import {Vivienda} from "../modelos/Vivienda";
import {ViviendaService} from "../servicios/vivienda-service";

@Component({
  selector: 'app-lista-viviendas',
  templateUrl: './lista-viviendas.component.html',
  styleUrls: ['./lista-viviendas.component.scss'],
  standalone: true,
  imports: [
    FooterVecinoComponent,
    HeaderComponent,
    HeaderVecinoComponent,
    IonicModule,
    NavLateralDerechoVecinoComponent,
    NavLateralVecinoComponent,
    NgOptimizedImage,
    NavLateralComunidadComponent,
    FooterComunidadComponent
  ]
})
export class ListaViviendasComponent  implements OnInit {

  notificacionesPendientes = 0
  private usuario!: Usuario
  private comunidad!: Comunidad
  listaViviendas: Vivienda[] = []
  correo!: string
  todasViviendas: Vivienda[] = []

  constructor(private router: Router,
              private usuarioService: UsuarioService,
              private viviendaService: ViviendaService,
              private comunidadService: ComunidadService) { }

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
          this.listarViviendas()
        }
      })
    }
  }

  listarViviendas() {
    if (this.comunidad.id) {
      this.viviendaService.listarViviendasComunidad(this.comunidad.id).subscribe({
        next: data => {
          this.listaViviendas = data
          this.todasViviendas = data;
          this.listarSolicitudes()

        }
      });
    }
  }

  filtrarViviendas(event: any): void {
    const texto = event.target?.value?.toLowerCase() || '';
    this.listaViviendas = this.todasViviendas.filter(vivienda =>
      vivienda.direccionPersonal.toLowerCase().includes(texto)
    )
  }

  listarSolicitudes() {
    this.comunidadService.listarSolicitudes(this.comunidad.id).subscribe({
      next: data => this.notificacionesPendientes = data.length
    })
  }


  crearVivienda() {
    this.router.navigate(["/crear-vivienda"])
  }

  navigateToNotificaciones() {
    this.router.navigate(["/notificaciones-comunidad"])
  }

}
