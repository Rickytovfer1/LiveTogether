import { Component, OnInit } from '@angular/core';
import {FooterComunidadComponent} from "../footer-comunidad/footer-comunidad.component";
import {HeaderComponent} from "../header/header.component";
import {IonicModule, ToastController} from "@ionic/angular";
import {NavLateralComunidadComponent} from "../nav-lateral-comunidad/nav-lateral-comunidad.component";
import {NgOptimizedImage} from "@angular/common";
import {VecinoGastos} from "../modelos/VecinoGastos";
import {Vecino} from "../modelos/Vecino";
import {Usuario} from "../modelos/Usuario";
import {jwtDecode} from "jwt-decode";
import {TokenDataDTO} from "../modelos/TokenDataDTO";
import {ComunidadService} from "../servicios/comunidad-service";
import {ActivatedRoute, Router} from "@angular/router";
import {UsuarioService} from "../servicios/usuario-service";
import {ViviendaService} from "../servicios/vivienda-service";
import {SancionService} from "../servicios/sancion-service";
import {AlertController} from "@ionic/angular/standalone";
import {GastoService} from "../servicios/gasto-service";
import {environment} from "../../environments/environment";
import {Comunidad} from "../modelos/Comunidad";
import {Vivienda} from "../modelos/Vivienda";
import {Sancion} from "../modelos/Sancion";
import {Gasto} from "../modelos/Gasto";
import {EditarVivienda} from "../modelos/EditarVivienda";
import {
  NavLateralDerechoComunidadComponent
} from "../nav-lateral-derecho-comunidad/nav-lateral-derecho-comunidad.component";

@Component({
    selector: 'app-info-vivienda',
    templateUrl: './info-vivienda.component.html',
    styleUrls: ['./info-vivienda.component.scss'],
    standalone: true,
  imports: [
    FooterComunidadComponent,
    HeaderComponent,
    IonicModule,
    NavLateralComunidadComponent,
    NgOptimizedImage,
    NavLateralDerechoComunidadComponent
  ]
})
export class InfoViviendaComponent  implements OnInit {

  baseUrl: string = environment.apiUrl;

  correo?: string;
  private usuario!: Usuario
  private comunidad!: Comunidad
  vivienda!: Vivienda

  propietario!: Vecino
  idVivienda!: number
  residentes: Vecino[] = []
  sanciones: Sancion[] = []
  deudas: Gasto[] = []
  deudores: VecinoGastos[] = []

  editarVivienda: EditarVivienda = {
    direccionPersonal: ""
  }

  constructor(private comunidadService: ComunidadService,
              private router: Router,
              private usuarioService: UsuarioService,
              private gastoService: GastoService,
              private activateRoute: ActivatedRoute,
              private viviendaService: ViviendaService,
              private sancionService: SancionService,
              private alertController: AlertController,
              private toastController: ToastController) {
  }

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

    this.activateRoute.params.subscribe(params => {
      this.idVivienda = Number(params['id']);
    });
    this.verInfoVivienda(this.idVivienda)
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
        }
      })
    }
  }

  listarResidentes() {
    this.residentes = []
    let resultado = []
    this.viviendaService.listarResidentesComunidad(this.vivienda.id).subscribe({
      next: data => {
        for (const vecino of data) {
          resultado.push(vecino)
        }
        this.residentes = resultado.filter((obj, index, self) =>
          index === self.findIndex(o => o.id === obj.id))

        this.propietario = this.residentes.find(vecino =>
          vecino.id === this.vivienda.idPropietario)!;
        this.cargarGastos()
        this.cargarSanciones()
      }
    })
  }

  cargarGastos() {
    this.deudas = []
    if (this.comunidad.id) {
      this.gastoService.listarGastosComunidad(this.comunidad.id).subscribe({
        next: data => {
          for (const gasto of data) {
            if (this.propietario && !gasto.pagados.includes(this.propietario.id) && gasto.pendientes.includes(this.propietario.id)) {
              this.deudas.push(gasto)
            }
          }
        }
      })
    }
  }

  cargarSanciones() {
    if (this.propietario) {
      this.sancionService.listarSancionesVecinoComunidad(this.comunidad.id, this.propietario.id).subscribe({
        next: data => this.sanciones = data
      })
    }
  }

  verInfoVivienda(idVivienda: number) {
    this.viviendaService.verInfoVivienda(idVivienda).subscribe({
      next: data => {
        this.vivienda = data;
        this.listarResidentes()
      }
    })
  }

  comprobarIdentidad(vecino: Vecino): string {
    if (this.comunidad.idPresidente) {
      if (vecino.id === this.comunidad.idPresidente) {
        this.propietario = vecino
        return "Presidente de la comunidad"

      } else if (vecino.id === this.vivienda.idPropietario) {
        this.propietario = vecino
        return "Propietario de la vivienda"

      } else {
        return "Residente"
      }
    }
    return ""
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

  asignarPropietario(vecino: Vecino) {
    this.viviendaService.asignarPropietario(this.vivienda.id, vecino.id).subscribe({
      next: () => this.verInfoVivienda(this.idVivienda)
    })
  }

  async confirmarAsignacion(vecino: Vecino) {
    const alert = await this.alertController.create({
      header: 'Confirmar asignación',
      message: `¿Estás seguro de que quieres hacer a al vecino ${vecino.nombre} ${vecino.apellidos} propietario de la vivienda ${this.vivienda.direccionPersonal}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            alert.dismiss()
          }
        },
        {
          text: 'Confirmar',
          role: 'confirm',
          handler: () => {
            this.asignarPropietario(vecino);
          }
        }
      ]
    });
    await alert.present();
  }

  generarCodigo() {
    this.comunidadService.generarCodigo(this.idVivienda, this.comunidad.id).subscribe({
      next: data => this.mostrarCodigo(data)
    })
  }

  async mostrarCodigo(codigo: string) {
    const alert = await this.alertController.create({
      header: `Comparte este código con un vecino:\n\n\n`,
      message: `${codigo}`,
      buttons: [
        {
          text: 'Cerrar',
          role: 'confirm',
          handler: () => {
            alert.dismiss()
          }
        },
        {
          text: 'Copiar',
          role: 'confirm',
          handler: async () => {
            try {
              await navigator.clipboard.writeText(codigo);
              const toast = await this.toastController.create({
                message: 'Código copiado al portapapeles',
                duration: 2000,
                color: 'success',
                position: 'top'
              });
              await toast.present();
            } catch (e) {
              const toast = await this.toastController.create({
                message: 'Error al copiar el código',
                duration: 2000,
                color: 'danger',
                position: 'top'
              });
              await toast.present();
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async editarNombreVivienda() {
    const alert = await this.alertController.create({
      header: 'Cambiar nombre de la vivienda',
      inputs: [
        {
          name: 'nuevaDireccion',
          type: 'text',
          placeholder: 'Nuevo nombre de la vivienda',
          value: this.vivienda.direccionPersonal
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Guardar',
          handler: data => {
            this.editarVivienda.direccionPersonal = data.nuevaDireccion;

            this.viviendaService.editarVivienda(this.editarVivienda, this.vivienda.id).subscribe({
              next: () => this.verInfoVivienda(this.vivienda.id),
              error: () => {
                console.error("Error al actualizar la direccion de la vivienda.");
              }
            });
          }
        }
      ]
    });

    await alert.present();
  }

  async confirmarEliminacion(residente: Vecino) {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: `¿Estás seguro de que quieres eliminar a ${residente.nombre} ${residente.apellidos} de la comunidad?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: async () => {
            this.gastoService.listarDeudoresIdComunidad(this.comunidad.id).subscribe({
              next: async (deudores: VecinoGastos[]) => {
                const deudor = deudores.find(d => d.id === residente.id && d.gastosPendientes.length > 0);
                if (deudor) {
                  const toast = await this.toastController.create({
                    message: `No se puede eliminar. ${residente.nombre} tiene gastos pendientes.`,
                    duration: 3000,
                    color: 'danger',
                    position: 'top'
                  });
                  await toast.present();
                } else {
                  this.viviendaService.eliminarResidente(this.vivienda.id, residente.id).subscribe({
                    next: async () => {
                      const toast = await this.toastController.create({
                        message: 'Residente eliminado correctamente.',
                        duration: 2000,
                        color: 'success',
                        position: 'top'
                      });
                      await toast.present();
                      this.listarResidentes();
                    }
                  });
                }
              }
            });
          }
        }
      ]
    });

    await alert.present();
  }

  volverAtras(): void {
    this.router.navigate(['/lista-viviendas']);
  }
}
