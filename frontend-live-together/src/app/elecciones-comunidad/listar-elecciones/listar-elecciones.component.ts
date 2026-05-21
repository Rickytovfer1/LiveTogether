import { Component, OnInit } from '@angular/core';
import {Eleccion} from "../../modelos/Eleccion";
import {Usuario} from "../../modelos/Usuario";
import {TokenDataDTO} from "../../modelos/TokenDataDTO";
import {jwtDecode} from "jwt-decode";
import {AlertController, IonGrid, IonImg, IonRow} from "@ionic/angular/standalone";
import {EleccionesService} from "../../servicios/elecciones-service";
import {UsuarioService} from "../../servicios/usuario-service";
import {Router} from "@angular/router";
import {ComunidadService} from "../../servicios/comunidad-service";
import {Comunidad} from "../../modelos/Comunidad";
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-listar-elecciones',
  templateUrl: './listar-elecciones.component.html',
  styleUrls: ['./listar-elecciones.component.scss'],
  standalone: true,
  imports: [
    IonGrid,
    IonRow,
    IonImg,
    NgClass
  ]
})
export class ListarEleccionesComponent  implements OnInit {

  correo?: string;
  private usuario!: Usuario
  private comunidad!: Comunidad
  listaElecciones: Eleccion[] = []


  constructor(private comunidadService: ComunidadService,
              private router: Router,
              private usuarioService: UsuarioService,
              private eleccionService: EleccionesService,
              private alertController: AlertController) { }

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
          this.listarElecciones()
        }
      })
    }
  }

  listarElecciones() {
    if (this.comunidad.id) {
      this.eleccionService.listarEleccionesComunidad(this.comunidad.id).subscribe({
        next: data => {
          this.listaElecciones = data.sort((a, b) => {
            return new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
          });
        }
      });
    }
  }

  calcularFecha(fechaISO: string): string {
    const fecha = new Date(fechaISO);
    const hoy = new Date();
    const ayer = new Date();
    ayer.setDate(hoy.getDate() - 1);

    const esMismaFecha = (a: Date, b: Date): boolean =>
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate();

    if (esMismaFecha(fecha, hoy)) {
      return 'Hoy';
    } else if (esMismaFecha(fecha, ayer)) {
      return 'Ayer';
    } else {
      const meses = [
        'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
        'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
      ];
      const dia = fecha.getDate();
      const mes = meses[fecha.getMonth()];
      const año = fecha.getFullYear();
      return `${dia} de ${mes} de ${año}`;
    }
  }

  comprobarEstado(eleccion: Eleccion): string {
    if (!eleccion.abierta) {
      return "Cerrada";
    }else {
      return "Abierta"
    }

  }

  cerrarEleccion(idEleccion: number) {
    if (idEleccion) {
      this.eleccionService.cerrarEleccion(idEleccion).subscribe({
        next: () => {
          this.listaElecciones = []
          this.listarElecciones()
        },
        error: (e) => {
          console.error("Error al cerrar la elección:", e);
        }
      });
    }
  }


  async confirmarEleccion(idEleccion: number) {
    const alert = await this.alertController.create({
      header: 'Confirmar cierre de elección',
      message: '¿Estás seguro de que quieres cerrar esta elección?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Eleccion cancelado');
          }
        },
        {
          text: 'Confirmar',
          role: 'confirm',
          handler: () => {
            this.cerrarEleccion(idEleccion);
          }
        }
      ]
    });

    await alert.present();
  }

  verVotos(eleccion: Eleccion) {
    this.router.navigate(['ver-votos', eleccion.id])
  }

}
