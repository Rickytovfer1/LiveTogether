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
import {Vivienda} from "../modelos/Vivienda";
import {ViviendaService} from "../servicios/vivienda-service";
import {TipoNotificacion} from "../modelos/Notificacion";

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
  viviendas: Vivienda[] = [];

  idVivienda?: number;
  idComunidad?: number;
  idVecino?: number;

  insertarCodigo: InsertarCodigo = {
    codigoComunidad: "",
    idVecino: undefined
  };

  constructor(
    private comunidadService: ComunidadService,
    private router: Router,
    private usuarioService: UsuarioService,
    private vecinoService: VecinoService,
    private viviendaService: ViviendaService
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

  async presentToast(id: string) {
    const toast = document.getElementById(id) as any;
    if (toast) {
      await toast.present();
    }
  }

  insertarCodigoComunidad() {
    const ids: number[] = [this.insertarCodigo.idVecino!]
    if (!this.insertarCodigo.idVecino) {
      console.error("Vecino aún no cargado");
      return;
    }

    if (!this.insertarCodigo.codigoComunidad) {
      this.presentToast("toastVacio");
      return;
    }
    this.vecinoService.buscarComunidadPorCodigo(this.insertarCodigo.codigoComunidad).subscribe({
      next: data => {
        this.comunidadService.enviarNotificacionVecino(ids, data.id, TipoNotificacion.BIENVENIDA).subscribe({
          next: () => {
            this.comunidadService.insertarCodigo(this.insertarCodigo).subscribe({
              next: () => {
                this.presentToast("toastCodigoCorrecto");
                this.router.navigate(['/comunidades'])
              },
              error: () => {
                this.presentToast("toastCodigoError");
              }
            });
          }
        })
      }
    })
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
          this.cargarComunidades();
        }
      });
    }
  }

  solicitarUnion() {
    if (this.idVivienda && this.idComunidad && this.vecino.id) {
      this.comunidadService.solicitarUnion(this.idVivienda, this.idComunidad, this.vecino.id).subscribe({
        next: () => {
          this.presentToast("toastUnionCorrecta");
          this.router.navigate(['/comunidades']);
        },
        error: () => {
          console.log('Error al solicitar unión.');
          this.presentToast("toastUnionError");
        }
      });
    } else {
      console.warn('Faltan datos para solicitar unión.');
      this.presentToast("toastFaltanDatos");
    }
  }

  cargarComunidades() {
    this.comunidadService.listarTodasComunidades().subscribe({
      next: (data: Comunidad[]) => {
        this.comunidades = data;
      },
      error: () => {
        console.log("Error al cargar comunidades");
      }
    });
  }

  cargarVivienda(idComunidad: number | undefined) {
    this.viviendaService.listarViviendas(idComunidad).subscribe({
      next: (data: Vivienda[]) => {
        this.viviendas = data;
      },
      error: () => {
        console.log("Error al cargar comunidades");
      }
    });
  }

}
