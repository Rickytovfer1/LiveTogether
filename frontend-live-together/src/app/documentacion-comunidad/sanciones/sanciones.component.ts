import { Component, OnInit } from '@angular/core';
import {Sancion} from "../../modelos/Sancion";
import {Usuario} from "../../modelos/Usuario";
import {Comunidad} from "../../modelos/Comunidad";
import {Vecino} from "../../modelos/Vecino";
import {NavigationEnd, Router} from "@angular/router";
import {SancionService} from "../../servicios/sancion-service";
import {UsuarioService} from "../../servicios/usuario-service";
import {ComunidadService} from "../../servicios/comunidad-service";
import {ToastController} from "@ionic/angular";
import {AlertController, IonCol, IonContent, IonGrid, IonImg, IonRow} from "@ionic/angular/standalone";
import {filter} from "rxjs";
import {jwtDecode} from "jwt-decode";
import {TokenDataDTO} from "../../modelos/TokenDataDTO";

@Component({
  selector: 'app-sanciones',
  templateUrl: './sanciones.component.html',
  styleUrls: ['./sanciones.component.scss'],
  standalone: true,
  imports: [
    IonCol,
    IonRow,
    IonGrid,
    IonContent,
    IonImg
  ]
})
export class SancionesComponent  implements OnInit {

  listaSanciones: Sancion[] = [];
  correo?: string;
  private usuario!: Usuario;
  comunidad!: Comunidad;
  vecinosMap: { [id: number]: Vecino } = {};

  constructor(private router: Router,
              private sancionService: SancionService,
              private usuarioService: UsuarioService,
              private comunidadService: ComunidadService,
              private toastController: ToastController,
              private alertController: AlertController) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        if (event.urlAfterRedirects === '/documentacion/comunidad') {
          this.inicio();
        }
      });
  }

  ngOnInit() {
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
        }
      } catch (e) {
        console.error('Error al decodificar el token:', e);
      }
    } else {
      this.router.navigate(['/']);
    }
  }

  ionViewWillEnter() {
    this.listarSanciones();
  }

  cargarUsuario(correo: string): void {
    this.usuarioService.cargarUsuarioComunidad(correo).subscribe({
      next: (usuario: Usuario) => {
        this.usuario = usuario;
        if (this.usuario && this.usuario.id) {
          this.cargarComunidad();
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
          this.comunidad = data;
          this.listarSanciones();
        }
      });
    }
  }

  listarSanciones() {
    if (this.comunidad.id) {
      this.sancionService.listarSancionesComunidad(this.comunidad.id).subscribe({
        next: data => {
          this.listaSanciones = data;

          const idsVecinos = [...new Set(this.listaSanciones.map(s => s.idVecino))];
          idsVecinos.forEach(idVecino => {
            if (idVecino) {
              this.comunidadService.cargarVecinoPorIdVecinoComunidad(idVecino).subscribe({
                next: vecino => {
                  this.vecinosMap[idVecino] = vecino;
                },
                error: err => {
                  console.error(`Error al cargar vecino ${idVecino}:`, err);
                }
              });
            }
          });
        }
      });
    }
  }

  navigateToCrearSancion() {
    this.router.navigate(['crear-sancion-comunidad']);
  }

  protected readonly String = String;

  async confirmarEliminacion(idSancion: number) {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: `¿Estás seguro de que quieres eliminar esta sanción?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.sancionService.eliminarSancionComunidad(idSancion).subscribe({
              next: async () => {
                this.listaSanciones = this.listaSanciones.filter(c => c.id !== idSancion);
                const toast = await this.toastController.create({
                  message: 'La sanción ha sido eliminado correctamente.',
                  duration: 2000,
                  color: 'success',
                  position: 'top'
                });
                await toast.present();
              },
              error: async () => {
                const toast = await this.toastController.create({
                  message: 'Error al eliminar la sanción.',
                  duration: 2000,
                  color: 'danger',
                  position: 'top'
                });
                await toast.present();
              }
            });
          }
        }
      ]
    });

    await alert.present();
  }

}
