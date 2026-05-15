import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ComunService} from "./comun-service";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {Comunidad} from "../modelos/Comunidad";
import {InsertarCodigo} from "../modelos/InsertarCodigo";
import {Vecino} from "../modelos/Vecino";
import {VecinoUsuarioDTO} from "../modelos/VecinoUsuarioDTO";
import {Solicitud} from "../modelos/Solicitud";
import {TipoNotificacion} from "../modelos/Notificacion";

@Injectable({
  providedIn: 'root',
})
export class ComunidadService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private comunService: ComunService) { }

  listarComunidades(idVecino: number): Observable<Comunidad[]> {
    const options = this.comunService.autorizarPeticion();
    return this.http.get<Comunidad[]>(`${this.apiUrl}/vecino/listar/comunidades/${idVecino}`, options)
  }

  insertarCodigo(insertarCodigo: InsertarCodigo): Observable<any> {
    const options = this.comunService.autorizarPeticion();
    return this.http.post(`${this.apiUrl}/vecino/insertar/codigo`, insertarCodigo, options);
  }

  cargarComunidadPorIdUsuario(idUsuario: number): Observable<Comunidad> {
    const options = this.comunService.autorizarPeticion();
    return this.http.get<Comunidad>(`${this.apiUrl}/comunidad/ver/comunidad/usuario/${idUsuario}`, options)
  }

  cargarVecinoPorIdVecinoComunidad(idVecino: number): Observable<Vecino> {
    const options = this.comunService.autorizarPeticion();
    return this.http.get<Vecino>(`${this.apiUrl}/comunidad/ver/vecino/${idVecino}`, options)
  }

  listarPropietariosComunidad(idComunidad: number): Observable<VecinoUsuarioDTO[]> {
    const options = this.comunService.autorizarPeticion();
    return this.http.get<VecinoUsuarioDTO[]>(`${this.apiUrl}/comunidad/listar/propietarios/${idComunidad}`, options)
  }

  listarTodasComunidades(): Observable<Comunidad[]> {
    const options = this.comunService.autorizarPeticion();
    return this.http.get<Comunidad[]>(`${this.apiUrl}/vecino/listar/todas/comunidades`, options)
  }

  listarSolicitudes(idComunidad: number): Observable<Solicitud[]> {
    const options = this.comunService.autorizarPeticion();
    return this.http.get<Solicitud[]>(`${this.apiUrl}/comunidad/listar/solicitudes/${idComunidad}`, options);
  }

  solicitarUnion(idVivienda: number, idComunidad: number, idVecino: number): Observable<any> {
    const options = this.comunService.autorizarPeticion();
    return this.http.post(`${this.apiUrl}/vecino/solicitar/${idVivienda}/${idComunidad}/${idVecino}`, {} ,options);
  }

  aceptarSolicitud(solicitud: Solicitud) {
    const options = this.comunService.autorizarPeticion();
    return this.http.post(`${this.apiUrl}/comunidad/aceptar/solicitud`, solicitud ,options);
  }

  rechazarSolicitud(solicitud: Solicitud) {
    const options = this.comunService.autorizarPeticion();
    return this.http.post(`${this.apiUrl}/comunidad/rechazar/solicitud`, solicitud ,options);
  }

  enviarNotificacion(idsVecinos: number[], idComunidad: number, tipo: TipoNotificacion) {
    const options = this.comunService.autorizarPeticion();
    return this.http.post(`${this.apiUrl}/comunidad/enviar/notificacion/${idsVecinos}/${idComunidad}/${tipo}`, {}, options)
  }

  enviarNotificacionVecino(idsVecinos: number[], idComunidad: number, tipo: TipoNotificacion) {
    const options = this.comunService.autorizarPeticion();
    return this.http.post(`${this.apiUrl}/vecino/enviar/notificacion/${idsVecinos}/${idComunidad}/${tipo}`, {}, options)
  }

  listarVecinosComunidad(idComunidad: number): Observable<VecinoUsuarioDTO[]> {
    const options = this.comunService.autorizarPeticion();
    return this.http.get<VecinoUsuarioDTO[]>(`${this.apiUrl}/comunidad/listar/vecinos/comunidad/${idComunidad}`, options)
  }
}
