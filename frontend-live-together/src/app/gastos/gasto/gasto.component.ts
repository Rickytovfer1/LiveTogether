import {Component, OnDestroy, OnInit} from '@angular/core';
import {HeaderComponent} from "../../header/header.component";
import {IonicModule} from "@ionic/angular";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {Comunidad} from "../../modelos/Comunidad";
import {Gasto} from "../../modelos/Gasto";
import {Vecino} from "../../modelos/Vecino";
import {jwtDecode} from "jwt-decode";
import {Usuario} from "../../modelos/Usuario";
import {NgIf} from "@angular/common";
import {filter} from "rxjs";
import {environment} from "../../../environments/environment";
import {VecinoUsuarioDTO} from "../../modelos/VecinoUsuarioDTO";
import {HeaderVecinoComponent} from "../../header-vecino/header-vecino.component";
import {NavLateralVecinoComponent} from "../../nav-lateral-vecino/nav-lateral-vecino.component";
import {FooterVecinoComponent} from "../../footer-vecino/footer-vecino.component";
import {NavLateralDerechoVecinoComponent} from "../../nav-lateral-derecho-vecino/nav-lateral-derecho-vecino.component";
import {GastoService} from "../../servicios/gasto-service";
import {UsuarioService} from "../../servicios/usuario-service";
import {VecinoService} from "../../servicios/vecino-service";
import {TokenDataDTO} from "../../modelos/TokenDataDTO";
import {loadStripe} from "@stripe/stripe-js";

@Component({
  selector: 'app-gasto',
  templateUrl: './gasto.component.html',
  styleUrls: ['./gasto.component.scss'],
  standalone: true,
  imports: [
    HeaderComponent,
    IonicModule,
    HeaderVecinoComponent,
    NavLateralVecinoComponent,
    FooterVecinoComponent,
    NavLateralDerechoVecinoComponent
  ]
})
export class GastoComponent implements OnInit {

  comunidadObjeto!: Comunidad
  gasto: Gasto = {} as Gasto;
  idGasto!: number;
  totalPorVecino: number = 0;
  porcentajePagado: number = 0;
  usuario: Usuario = {} as Usuario;
  vecino: Vecino = {} as Vecino;
  correo?: string
  listaPropietarios: VecinoUsuarioDTO[] =[]

  constructor(private router: Router,
              private gastosService: GastoService,
              private activateRoute: ActivatedRoute,
              private usuarioService: UsuarioService,
              private vecinoService: VecinoService) {
  }

  ngOnInit() {
    this.activateRoute.params.subscribe(params => {
      this.idGasto = Number(params['id']);
    });

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

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        if (!event.urlAfterRedirects.includes('/gastos/gasto')) {
          sessionStorage.removeItem('gasto');
        }
      });
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
          this.listarPropietarios()
        }
      })
    }
  }

  listarPropietarios() {
    if (this.vecino.id && this.comunidadObjeto.id) {
      this.vecinoService.listarPropietarios(this.comunidadObjeto.id).subscribe({
        next: data => {
          this.listaPropietarios = data
          this.verGasto(this.idGasto)
          this.calcularPorcentajePagado(this.idGasto)
        }
      })
    }
  }

  verGasto(idGasto: number) {
    if (idGasto)
      this.gastosService.verGasto(idGasto).subscribe({
        next: data => {
          this.gasto = data;
          sessionStorage.setItem('gasto', JSON.stringify(this.gasto));
          this.totalPorVecino = this.gasto.total / (this.gasto.pendientes.length + this.gasto.pagados.length);
        }
      });
  }

  calcularPorcentajePagado(idGasto: number) {
    if (idGasto)
      this.gastosService.calcularPorcentajePagado(idGasto).subscribe({
        next: data => {
          this.porcentajePagado = data
        }
      })
  }

  stripeClavePublica = 'pk_test_51RIofJQu2AOfAVJhL5JoD26V1FmzcDjuqnKvY2jXakWcYFC3Xvdgy0AvwyW8vZVsHYmjoPyysEuyQDIObfo9jURb006ljK69KO';

  async iniciarPago() {
    const stripe = await loadStripe(this.stripeClavePublica);
    const idSesion = await this.crearSesionPago();

    if (stripe && idSesion) {
      stripe.redirectToCheckout({ sessionId: idSesion });
    }
  }

  async crearSesionPago(): Promise<string> {
    const respuesta = await fetch('https://livetogether-30il.onrender.com/api/pago/crear-sesion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        gasto: 'Pago de gasto de comunidad: '+ this.gasto.concepto,
        cantidad: Math.round(this.totalPorVecino * 100)
      })
    });

    const datos = await respuesta.json();
    return datos.idSesion;
  }

  estaPagado(gasto: Gasto): boolean {
    if (!gasto || !Array.isArray(gasto.pendientes) || !this.vecino.id) {
      return false;
    }
    return !gasto.pendientes.includes(this.vecino.id);
  }

  mensajeBotonPagar(gasto: Gasto): string {
    if (!Array.isArray(this.listaPropietarios) || !this.vecino.id || !gasto || !Array.isArray(gasto.pendientes) || !Array.isArray(gasto.pagados)) {
      return ''
    }
    if (!this.listaPropietarios.some(v => v.id === this.vecino.id)) {
      return 'Solo los propietarios de vivienda se pueden hacer cargo de los gastos';
    } else if (!gasto.pagados.includes(this.vecino.id) && !gasto.pendientes.includes(this.vecino.id)) {
      return 'El pago de este gasto no te corresponde';
    } else if (gasto.pagados.includes(this.vecino.id)) {
      return 'Pagado';
    } else {
      return 'Pagar'
    }
  }
}
