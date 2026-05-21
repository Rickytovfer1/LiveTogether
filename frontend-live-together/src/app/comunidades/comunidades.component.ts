import { Component, OnInit } from '@angular/core';
import {IonicModule, Platform, ToastController} from "@ionic/angular";
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
import {VecinoGastos} from "../modelos/VecinoGastos";
import {Vivienda} from "../modelos/Vivienda";
import {AlertController} from "@ionic/angular/standalone";
import {GastoService} from "../servicios/gasto-service";
import {Observable} from "rxjs";
import {ViviendaService} from "../servicios/vivienda-service";

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
              private comunidadService: ComunidadService,
              private alertController: AlertController,
              private toastController: ToastController,
              private gastosService: GastoService,
              private viviendaService: ViviendaService,) { }

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

  cargarViviendas(idComunidad: number): Observable<Vivienda[]> {
    return this.viviendaService.listarViviendas(idComunidad);
  }

  async confirmarSalida(event: Event, comunidad: Comunidad) {
    event.stopPropagation();

    const alert = await this.alertController.create({
      header: 'Confirmar salida',
      message: `¿Estás seguro de que quieres salir de la comunidad ${comunidad.nombre}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Salir',
          role: 'destructive',
          handler: async () => {
            if (this.vecino?.id && comunidad?.id) {
              this.gastosService.listarDeudoresIdComunidadVecino(comunidad.id).subscribe({
                next: async (deudores: VecinoGastos[]) => {
                  const deudor = deudores.find(d => d.id === this.vecino.id && d.gastosPendientes.length > 0);
                  if (deudor) {
                    const toast = await this.toastController.create({
                      message: `No puedes salir de la comunidad. Tienes gastos pendientes.`,
                      duration: 3000,
                      color: 'danger',
                      position: 'top'
                    });
                    await toast.present();
                  } else {
                    this.cargarViviendas(comunidad.id).subscribe({
                      next: (viviendas: Vivienda[]) => {
                        const vivienda = viviendas.find(v => Array.isArray(v.idVecinos) && v.idVecinos.includes(this.vecino.id));
                        if (vivienda && vivienda.id) {
                          this.viviendaService.salirComunidad(vivienda.id, this.vecino.id).subscribe({
                            next: async () => {
                              this.listaComunidades = this.listaComunidades.filter(c => c.id !== comunidad.id);
                              const toast = await this.toastController.create({
                                message: 'Has salido correctamente de la comunidad.',
                                duration: 2000,
                                color: 'success',
                                position: 'top'
                              });
                              await toast.present();
                            },
                            error: async () => {
                              const toast = await this.toastController.create({
                                message: 'Error al salir de la comunidad.',
                                duration: 2000,
                                color: 'danger',
                                position: 'top'
                              });
                              await toast.present();
                            }
                          });
                        }                       },
                      error: async () => {
                        const toast = await this.toastController.create({
                          message: 'Error al obtener las viviendas.',
                          duration: 2000,
                          color: 'danger',
                          position: 'top'
                        });
                        await toast.present();
                      }
                    });
                  }
                },
                error: async () => {
                  const toast = await this.toastController.create({
                    message: 'Error al verificar los gastos pendientes.',
                    duration: 2000,
                    color: 'danger',
                    position: 'top'
                  });
                  await toast.present();
                }
              });
            }
          }
        }
      ]
    });

    await alert.present();
  }

}
