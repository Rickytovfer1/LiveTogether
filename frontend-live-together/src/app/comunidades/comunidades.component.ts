import { Component, OnInit } from '@angular/core';
import {IonicModule, Platform} from "@ionic/angular";
import {HeaderComponent} from "../header/header.component";
import {FooterComponent} from "../footer/footer.component";
import {NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {NavLateralComponent} from "../nav-lateral/nav-lateral.component";
import {Comunidad} from "../modelos/Comunidad";
import {Router} from "@angular/router";
import {jwtDecode} from "jwt-decode";
import {TokenDataDTO} from "../modelos/TokenDataDTO";
import {VecinoService} from "../servicios/vecino-service";
import {ComunidadService} from "../servicios/comunidad-service";
import {UsuarioService} from "../servicios/usuario-service";
import {Vecino} from "../modelos/Vecino";
import {Usuario} from "../modelos/Usuario";

@Component({
  selector: 'app-comunidades',
  templateUrl: './comunidades.component.html',
  styleUrls: ['./comunidades.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    HeaderComponent,
    FooterComponent,
    NavLateralComponent,
  ]
})
export class ComunidadesComponent  implements OnInit {
  isDesktop: boolean = false;
  private usuario!: Usuario
  vecino!: Vecino
  listaComunidades: Comunidad[] = []
  correo!: string
  todasComunidades: Comunidad[] = []

  constructor(private platform: Platform,
              private router: Router,
              private usuarioService: UsuarioService,
              private vecinoService: VecinoService,
              private comunidadService: ComunidadService,) { }

  ngOnInit() {
    this.isDesktop = this.platform.width() >= 992;
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
    this.usuarioService.cargarUsuario(correo).subscribe({
      next: (usuario: Usuario) => {
        this.usuario = usuario;
        if (this.usuario && this.usuario.id) {
          this.cargarVecino()
        }
      },
      error: (e) => {
        console.error("Error al cargar el usuario:", e);
      }
    });
  }

  cargarVecino() {
    if (this.usuario.id) {
      this.vecinoService.cargarVecinoPorIdUsuario(this.usuario.id).subscribe({
        next: data => {
          this.vecino = data
          this.listarComunidades()
        }
      })
    }
  }

  listarComunidades() {
    if (this.vecino.id) {
      this.comunidadService.listarComunidades(this.vecino.id).subscribe({
        next: data => {
          this.todasComunidades = data;
          this.listaComunidades = data;
        }
      });
    }
  }

  filtrarComunidades(event: any): void {
    const texto = event.target?.value?.toLowerCase() || '';
    this.listaComunidades = this.todasComunidades.filter(comunidad =>
      comunidad.nombre.toLowerCase().includes(texto) ||
      comunidad.direccion.toLowerCase().includes(texto)
    );
  }

  navigateToComunidad(comunidad: Comunidad) {
    sessionStorage.setItem('comunidad', JSON.stringify(comunidad));
    this.router.navigate(['/comunidad/perfil']);
  }

}
