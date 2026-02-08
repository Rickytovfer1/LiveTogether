import { Component, OnInit } from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {Router} from "@angular/router";
import {FooterComponent} from "../footer/footer.component";
import {HeaderComponent} from "../header/header.component";
import {NavLateralComponent} from "../nav-lateral/nav-lateral.component";
import {Comunidad} from "../modelos/Comunidad";
import {Usuario} from "../modelos/Usuario";
import {Vecino} from "../modelos/Vecino";
import {InsertarCodigo} from "../modelos/InsertarCodigo";
import {ComunidadService} from "../servicios/comunidad-service";
import {UsuarioService} from "../servicios/usuario-service";
import {VecinoService} from "../servicios/vecino-service";
import {jwtDecode} from "jwt-decode";
import {TokenDataDTO} from "../modelos/TokenDataDTO";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-unirse-comunidad',
  templateUrl: './unirse-comunidad.component.html',
  styleUrls: ['./unirse-comunidad.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    FooterComponent,
    HeaderComponent,
    NavLateralComponent,
    FormsModule
  ]
})
export class UnirseComunidadComponent  implements OnInit {
  correo?: string;
  private usuario!: Usuario;
  private vecino!: Vecino;

  comunidades: Comunidad[] = [];


  insertarCodigo: InsertarCodigo = {
    codigoComunidad: "",
    idVecino: undefined
  };

  constructor(
    private comunidadService: ComunidadService,
    private router: Router,
    private usuarioService: UsuarioService,
    private vecinoService: VecinoService,
  ) {}

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
    }
  }

  insertarCodigoComunidad() {
    if (!this.insertarCodigo.idVecino) {
      console.error("Vecino aún no cargado");
      return;
    }

    if (!this.insertarCodigo.codigoComunidad) {
      console.error("Código vacío");
      return;
    }

    this.vecinoService.buscarComunidadPorCodigo(this.insertarCodigo.codigoComunidad).subscribe({
      next: () => {
        this.comunidadService.insertarCodigo(this.insertarCodigo).subscribe({
          next: () => {
            this.router.navigate(['/comunidades'])
          },
          error: (err) => {
            console.error("Error al insertar código:", err);
          }
        });
      },
      error: (err) => {
        console.error("Código inválido:", err);
      }
    });
  }

  cargarUsuario(correo: string): void {
    this.usuarioService.cargarUsuario(correo).subscribe({
      next: (usuario: Usuario) => {
        this.usuario = usuario;
        if (usuario && usuario.id) {
          this.cargarVecino()
          console.log(usuario)
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
          this.vecino = data;
          this.insertarCodigo.idVecino = this.vecino.id;
        }
      });
    }
  }


}
