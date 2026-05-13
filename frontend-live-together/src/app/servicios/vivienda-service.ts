import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {ComunService} from "./comun-service";
import {Observable} from "rxjs";
import {Vivienda} from "../modelos/Vivienda";
import {CrearVivienda} from "../modelos/CrearVivienda";

@Injectable({
  providedIn: 'root',
})
export class ViviendaService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private comunService: ComunService) { }

  listarViviendasComunidad(idComunidad: number): Observable<Vivienda[]> {
    const options = this.comunService.autorizarPeticion();
    return this.http.get<Vivienda[]>(`${this.apiUrl}/comunidad/listar/viviendas/${idComunidad}`, options)
  }


  crearVivienda(crearVivienda: CrearVivienda): Observable<any> {
    const options = this.comunService.autorizarPeticion();
    return this.http.post(`${this.apiUrl}/comunidad/crear/vivienda`, crearVivienda, options);
  }

}
