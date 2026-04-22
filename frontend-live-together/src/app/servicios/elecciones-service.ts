import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ComunService} from "./comun-service";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {Eleccion} from "../modelos/Eleccion";
import {EleccionVotos} from "../modelos/EleccionVotos";
import {CrearEleccion} from "../modelos/CrearEleccion";

@Injectable({
  providedIn: 'root',
})
export class EleccionesService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private comunService: ComunService) { }

  listarElecciones(idComunidad: number): Observable<Eleccion[]> {
    const options = this.comunService.autorizarPeticion();
    return this.http.get<Eleccion[]>(`${this.apiUrl}/vecino/listar/elecciones/${idComunidad}`, options)
  }

  getEleccion(idEleccion: number): Observable<Eleccion> {
    const options = this.comunService.autorizarPeticion();
    return this.http.get<Eleccion>(`${this.apiUrl}/vecino/ver/eleccion/${idEleccion}`, options)
  }

  totalVoto(idEleccion: number): Observable<number> {
    const options = this.comunService.autorizarPeticion();
    return this.http.get<number>(`${this.apiUrl}/vecino/ver/total/voto/${idEleccion}`, options)
  }

  crearEleccion(crearEleccion: CrearEleccion): Observable<any> {
    const options = this.comunService.autorizarPeticion();
    return this.http.post(`${this.apiUrl}/comunidad/crear/eleccion`, crearEleccion, options);
  }

  listarEleccionesComunidad(idComunidad: number): Observable<Eleccion[]> {
    const options = this.comunService.autorizarPeticion();
    return this.http.get<Eleccion[]>(`${this.apiUrl}/comunidad/listar/elecciones/${idComunidad}`, options)
  }

  cerrarEleccion(idEleccion: number): Observable<any> {
    const options = this.comunService.autorizarPeticion();
    return this.http.put(`${this.apiUrl}/comunidad/cerrar/eleccion/${idEleccion}`, {}, options);
  }

  getEleccionComunidad(idEleccion: number): Observable<EleccionVotos> {
    const options = this.comunService.autorizarPeticion();
    return this.http.get<EleccionVotos>(`${this.apiUrl}/comunidad/ver/eleccion/${idEleccion}`, options)
  }

  totalVotoComunidad(idEleccion: number): Observable<number> {
    const options = this.comunService.autorizarPeticion();
    return this.http.get<number>(`${this.apiUrl}/comunidad/ver/total/voto/${idEleccion}`, options)
  }
}
