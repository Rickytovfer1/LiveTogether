import { Component, OnInit } from '@angular/core';
import {AnadirGastoComponent} from "../gastos-comunidad/anadir-gasto/anadir-gasto.component";
import {DeudoresComponent} from "../gastos-comunidad/deudores/deudores.component";
import {FooterComunidadComponent} from "../footer-comunidad/footer-comunidad.component";
import {GastosComponent} from "../gastos-comunidad/gastos/gastos.component";
import {HeaderComponent} from "../header/header.component";
import {IonicModule} from "@ionic/angular";
import {NavLateralComunidadComponent} from "../nav-lateral-comunidad/nav-lateral-comunidad.component";
import {NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {Usuario} from "../modelos/Usuario";
import {Comunidad} from "../modelos/Comunidad";
import {CrearVivienda} from "../modelos/CrearVivienda";
import {Router} from "@angular/router";
import {UsuarioService} from "../servicios/usuario-service";
import {ViviendaService} from "../servicios/vivienda-service";
import {ComunidadService} from "../servicios/comunidad-service";
import {jwtDecode} from "jwt-decode";
import {TokenDataDTO} from "../modelos/TokenDataDTO";
import {
  NavLateralDerechoComunidadComponent
} from "../nav-lateral-derecho-comunidad/nav-lateral-derecho-comunidad.component";

@Component({
  selector: 'app-crear-vivienda',
  templateUrl: './crear-vivienda.component.html',
  styleUrls: ['./crear-vivienda.component.scss'],
  standalone: true,
  imports: [
    FooterComunidadComponent,
    HeaderComponent,
    IonicModule,
    NavLateralComunidadComponent,
    FormsModule,
    NavLateralDerechoComunidadComponent
  ]
})
export class CrearViviendaComponent  implements OnInit {

  private usuario!: Usuario
  private comunidad!: Comunidad
  correo!: string


  crearVvienda: CrearVivienda = {
    direccionPersonal: "",
    idComunidad: undefined
  }

  constructor(private router: Router,
              private usuarioService: UsuarioService,
              private viviendaService: ViviendaService,
              private comunidadService: ComunidadService) { }

  ngOnInit() {
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
    }}

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
          this.crearVvienda.idComunidad = this.comunidad.id
        }
      })
    }
  }

  volverAtras(): void {
    this.router.navigate(['/lista-viviendas']);
  }

  crearViviendaMetodo() {
    if (!this.crearVvienda.direccionPersonal || !this.crearVvienda.idComunidad) {
      const toast = document.getElementById("campoVacioVivienda") as any;
      toast.present();
      return;
    }
    this.viviendaService.crearVivienda(this.crearVvienda).subscribe({
      next: () => {
        const toast = document.getElementById("exitoCreacionVivienda") as any;
        toast.present();
        this.router.navigate(['/lista-viviendas']);
      },
      error: () => {
        console.log('Error al insertar codigo.');
      }
    });
  }

}
