import { Component, OnInit } from '@angular/core';
import {AnadirGastoComponent} from "../gastos-comunidad/anadir-gasto/anadir-gasto.component";
import {DeudoresComponent} from "../gastos-comunidad/deudores/deudores.component";
import {FooterComunidadComponent} from "../footer-comunidad/footer-comunidad.component";
import {GastosComponent} from "../gastos-comunidad/gastos/gastos.component";
import {HeaderComponent} from "../header/header.component";
import {IonicModule} from "@ionic/angular";
import {NavLateralComunidadComponent} from "../nav-lateral-comunidad/nav-lateral-comunidad.component";
import {NgIf} from "@angular/common";
import {Gasto} from "../modelos/Gasto";
import {TipoNotificacion} from "../modelos/Notificacion";
import {Usuario} from "../modelos/Usuario";
import {Comunidad} from "../modelos/Comunidad";
import {Vecino} from "../modelos/Vecino";
import {ComunidadService} from "../servicios/comunidad-service";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {UsuarioService} from "../servicios/usuario-service";
import {ViviendaService} from "../servicios/vivienda-service";
import {GastoService} from "../servicios/gasto-service";
import {jwtDecode} from "jwt-decode";
import {TokenDataDTO} from "../modelos/TokenDataDTO";
import {filter} from "rxjs";
import {IonToast} from "@ionic/angular/standalone";
import {
  NavLateralDerechoComunidadComponent
} from "../nav-lateral-derecho-comunidad/nav-lateral-derecho-comunidad.component";

@Component({
    selector: 'app-info-gasto',
    templateUrl: './info-gasto.component.html',
    styleUrls: ['./info-gasto.component.scss'],
    standalone: true,
  imports: [
    FooterComunidadComponent,
    HeaderComponent,
    IonicModule,
    NavLateralComunidadComponent,
    NavLateralDerechoComunidadComponent,
  ]
})
export class InfoGastoComponent  implements OnInit {

  correo?: string;
  private usuario!: Usuario
  private comunidad!: Comunidad
  gasto: Gasto = {} as Gasto;
  idGasto!: number;
  numeroPropietarios: number = 0;
  totalPorVecino: number = 0;
  porcentajePagado: number = 0;
  modalAbierto = false;
  gastoSeleccionado: Gasto | null = null;
  vecinoDeudas: Vecino[] = []
  idsSeleccionados: number[] = []

  constructor(private comunidadService: ComunidadService,
              private router: Router,
              private usuarioService: UsuarioService,
              private gastosService: GastoService,
              private viviendaService: ViviendaService,
              private activateRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activateRoute.params.subscribe(params => {
      this.idGasto = Number(params['id']);
    });

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

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        if (!event.urlAfterRedirects.includes('/info-gasto')) {
          sessionStorage.removeItem('gasto');
        }
      });

    this.calcularPorcentajePagado(this.idGasto)
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
          this.numeroViviendas(this.comunidad.id)

        }
      })
    }
  }

  verGasto(idGasto: number) {
    if (idGasto)
      this.gastosService.verGastoComunidad(idGasto).subscribe({
        next: data => {
          this.gasto = data;
          sessionStorage.setItem('gasto', JSON.stringify(this.gasto));
          if (this.numeroPropietarios > 0) {
            this.totalPorVecino = Number((this.gasto.total / (this.gasto.pagados.length + this.gasto.pendientes.length)).toFixed(2));
          }
          this.listarDeudores()
        }
      });
  }

  numeroViviendas(idComunidad: number) {
    if (idComunidad)
      this.viviendaService.numeroPropietarios(idComunidad).subscribe({
        next: data => {
          this.numeroPropietarios = data
          this.verGasto(this.idGasto);
        }
      })
  }

  calcularPorcentajePagado(idGasto: number) {
    if (idGasto)
      this.gastosService.calcularPorcentajePagado(idGasto).subscribe({
        next: data => {
          this.porcentajePagado = data
        }
      })
  }

  listarDeudores() {
    if (this.comunidad.id)
      this.gastosService.listarDeudoresIdGasto(this.gasto.id).subscribe({
        next: data => {
          this.vecinoDeudas = data
        }
      })
  }

  actualizarSeleccion(event: Event) {
    const input = event.target as HTMLInputElement;
    const id = +input.value;

    if (input.checked) {
      this.idsSeleccionados.push(id);
    } else {
      this.idsSeleccionados = this.idsSeleccionados.filter(i => i !== id);
    }
  }

  abrirModal(gasto: Gasto): void {
    if (this.porcentajePagado < 100) {
      this.gastoSeleccionado = gasto;
      this.modalAbierto = true;
    }
  }

  cerrarModal(): void {
    this.modalAbierto = false;
    this.gastoSeleccionado = null;
  }

  aceptar(): void {

    if (this.idsSeleccionados.length === 0) {
      const toast = document.getElementById("seleccionaUno") as any;
      toast.present();
      return;
    }

    this.comunidadService.enviarNotificacion(this.idsSeleccionados, this.comunidad.id, TipoNotificacion.DEUDA).subscribe({
      next: () => {
        const toast = document.getElementById("exitoEnviado") as any;
        toast.present();
        this.cerrarModal()
      }
    })
  }

}
