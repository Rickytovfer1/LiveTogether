import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {IonicModule, Platform} from "@ionic/angular";
import {Vecino} from "../modelos/Vecino";
import {Comunidad} from "../modelos/Comunidad";
import {environment} from "../../environments/environment";
import {Usuario} from "../modelos/Usuario";
import {Router} from "@angular/router";
import {UsuarioService} from "../servicios/usuario-service";
import {VecinoService} from "../servicios/vecino-service";
import {MensajeService} from "../servicios/mensaje-service";
import {jwtDecode} from "jwt-decode";
import {TokenDataDTO} from "../modelos/TokenDataDTO";
import {VecinoUsuarioDTO} from "../modelos/VecinoUsuarioDTO";
import {FooterVecinoComponent} from "../footer-vecino/footer-vecino.component";
import {HeaderComponent} from "../header/header.component";
import {HeaderVecinoComponent} from "../header-vecino/header-vecino.component";
import {NgForOf, NgIf, NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-lista-vecinos',
  templateUrl: './lista-vecinos.component.html',
  styleUrls: ['./lista-vecinos.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    FooterVecinoComponent,
    HeaderComponent,
    HeaderVecinoComponent,
    NgOptimizedImage,
    NgForOf,
    NgIf
  ]
})
export class ListaVecinosComponent  implements OnInit {
  baseUrl: string = environment.apiUrl;
  isDesktop: boolean = false;

  comunidadObjeto!: Comunidad
  usuario: Usuario = {} as Usuario;
  vecino: Vecino = {} as Vecino;
  correo?: string
  listaVecinos: VecinoUsuarioDTO[] = []
  ultimosMensajes: { [key: number]: string } = {}

  @Output() abrirChatDesktop = new EventEmitter<VecinoUsuarioDTO>();

  constructor(private router: Router,
              private usuarioService: UsuarioService,
              private vecinoService: VecinoService,
              private mensajeService: MensajeService,
              private platform: Platform) { }

  ngOnInit() {
    this.isDesktop = this.platform.width() >= 992;
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
          this.vecino = data;
          this.listarVecinos()
        }
      })
    }
  }

  listarVecinos() {
    if (this.comunidadObjeto?.id) {
      this.vecinoService.listarVecinosComunidad(this.comunidadObjeto.id).subscribe({
        next: data => {
          this.listaVecinos = data.filter(v => v.id !== this.vecino.id);
          this.cargarUltimosMensajes()
        },
        error: err => {
          console.error("Error al listar vecinos:", err);
        }
      });
    }
  }

  cargarUltimosMensajes() {
    for (const vecino of this.listaVecinos) {
      this.mensajeService.verConversacion(this.usuario.id, vecino.idUsuario).subscribe({
        next: data => {
          if (data.length !== 0) {
            data.sort((a, b) => new Date(a.fecha!).getTime() - new Date(b.fecha!).getTime())
            let ultimoMensaje = data[data.length - 1]
            if (ultimoMensaje.idEmisor === this.usuario.id) {
              this.ultimosMensajes[vecino.idUsuario] = "Tú: " + data[data.length - 1].texto
            } else {
              this.ultimosMensajes[vecino.idUsuario] = data[data.length - 1].texto
            }
          }
        }
      })
    }
    console.log(this.ultimosMensajes)
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

  navigateToChat(vecino: VecinoUsuarioDTO) {
    if (this.isDesktop) {
      this.abrirChatDesktop.emit(vecino);
    } else {
      this.router.navigate(['chat', vecino.idUsuario]);
    }
  }


}
