import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ComunService} from "./comun-service";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {Sancion} from "../modelos/Sancion";
import {CrearSancionComunidad} from "../modelos/CrearSancionComunidad";

@Injectable({
  providedIn: 'root',
})
export class SancionService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private comunService: ComunService) { }

  listarSanciones(idComunidad: number): Observable<Sancion[]> {
    const options = this.comunService.autorizarPeticion();
    return this.http.get<Sancion[]>(`${this.apiUrl}/vecino/listar/sanciones/${idComunidad}`, options)
  }

  listarSancionesComunidad(idComunidad: number): Observable<Sancion[]> {
    const options = this.comunService.autorizarPeticion();
    return this.http.get<Sancion[]>(`${this.apiUrl}/comunidad/listar/sanciones/${idComunidad}`, options)
  }

  eliminarSancionComunidad(idSancion: number): Observable<void> {
    const options = this.comunService.autorizarPeticion();
    return this.http.post<void>(`${this.apiUrl}/comunidad/eliminar/sancion/${idSancion}`, {}, options);
  }

  crearSancionComunidad(sanciones: CrearSancionComunidad): Observable<any> {
    const options = this.comunService.autorizarPeticion();
    return this.http.post(`${this.apiUrl}/comunidad/crear/sancion`, sanciones, options);
  }
}
