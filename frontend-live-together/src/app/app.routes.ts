import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'inicio-sesion',
    loadComponent: () => import('./inicio-sesion/inicio-sesion.component').then((m) => m.InicioSesionComponent),
  },
  {
    path: 'registro',
    loadComponent: () => import('./registro-vecino/registro/registro.component').then((m) => m.RegistroComponent),
  },
  {
    path: 'config-perfil-vecino',
    loadComponent: () => import('./registro-vecino/config-perfil-vecino/config-perfil-vecino.component').then((m) => m.ConfigPerfilVecinoComponent),
  },  {
    path: 'registro-vecino-index',
    loadComponent: () => import('./registro-vecino/index/index.component').then((m) => m.IndexComponent),
  },
  {
    path: 'comunidades',
    loadComponent: () => import('./comunidades/comunidades.component').then((m) => m.ComunidadesComponent),
  },
  {
    path: 'comunidad/perfil',
    loadComponent: () => import('./perfil-comunidad/perfil-comunidad.component').then((m) => m.PerfilComunidadComponent),
  },
  {
    path: 'chat/:id',
    loadComponent: () => import('./chat/chat.component').then((m) => m.ChatComponent),
  },
  {
    path: 'lista-vecinos',
    loadComponent: () => import('./lista-vecinos/lista-vecinos.component').then((m) => m.ListaVecinosComponent)
  },
  {
    path: 'notificaciones',
    loadComponent: () => import('./notificaciones/notificaciones.component').then((m) => m.NotificacionesComponent),
  },
  {
    path: 'comunidad/gastos',
    loadComponent: () => import('./gastos/gastos.component').then((m) => m.GastosComponent),
  },
  {
    path: 'unirse-comunidad',
    loadComponent: () => import('./unirse-comunidad/unirse-comunidad.component').then((m) => m.UnirseComunidadComponent),
  },
  {
    path: 'comunidad/gastos/gasto/:id',
    loadComponent: () => import('./gastos/gasto/gasto.component').then((m) => m.GastoComponent),
  },
  {
    path: 'comunidad/elecciones',
    loadComponent: () => import('./elecciones/elecciones.component').then((m) => m.EleccionesComponent),
  },
  {
    path: 'comunidad/elecciones/votacion/:id',
    loadComponent: () => import('./elecciones/votacion/votacion.component').then((m) => m.VotacionComponent),
  },
  {
    path: 'exito',
    loadComponent: () => import('./exito/exito.component').then(m => m.ExitoComponent),
  },
  {
    path: 'cancelado',
    loadComponent: () => import('./cancelado/cancelado.component').then(m => m.CanceladoComponent),
  },
  {
    path: 'comunidad/documentacion',
    loadComponent: () => import('./documentacion/documentacion.component').then((m) => m.DocumentacionComponent),
  },
  {
    path: 'crear-comunidad',
      loadComponent: () => import('./registroComunidad/crear-comunidad/crear-comunidad.component').then((m) => m.CrearComunidadComponent),
  },
  {
    path: 'lista-viviendas',
    loadComponent: () => import('./lista-viviendas/lista-viviendas.component').then((m) => m.ListaViviendasComponent),
  },
  {
    path: 'gastos/comunidad',
    loadComponent: () => import('./gastos-comunidad/gastos-comunidad.component').then((m) => m.GastosComunidadComponent),
  },
  {
    path: 'crear-vivienda',
    loadComponent: () => import('./crear-vivienda/crear-vivienda.component').then((m) => m.CrearViviendaComponent),
  },
  {
    path: 'elecciones/comunidad',
    loadComponent: () => import('./elecciones-comunidad/elecciones-comunidad.component').then((m) => m.EleccionesComunidadComponent),
  },
  {
    path: 'ver-votos/:id',
    loadComponent: () => import('./ver-votos/ver-votos.component').then((m) => m.VerVotosComponent),
  },
  {
    path: 'notificaciones-comunidad',
    loadComponent: () => import('./notificaciones-comunidad/notificaciones-comunidad.component').then((m) => m.NotificacionesComunidadComponent),
  },
  {
    path: 'info-gasto/:id',
    loadComponent: () => import('./info-gasto/info-gasto.component').then((m) => m.InfoGastoComponent),
  },
  {
    path: 'documentacion/comunidad',
    loadComponent: () => import('./documentacion-comunidad/documentacion-comunidad.component').then((m) => m.DocumentacionComunidadComponent),
  },
  {
    path: 'crear-comunicado-comunidad',
    loadComponent: () => import('./crear-comunicado-comunidad/crear-comunicado-comunidad.component').then((m) => m.CrearComunicadoComunidadComponent),
  },
  {
    path: 'crear-sancion-comunidad',
    loadComponent: () => import('./crear-sancion-comunidad/crear-sancion-comunidad.component').then((m) => m.CrearSancionComunidadComponent),
  },
  {
    path: 'info-vivienda/:id',
    loadComponent: () => import('./info-vivienda/info-vivienda.component').then((m) => m.InfoViviendaComponent)
  },
];
