import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {Gasto} from "../modelos/Gasto";
import {HttpClient} from "@angular/common/http";
import {ComunService} from "./comun-service";
import {environment} from "../../environments/environment";
import {CrearGasto} from "../modelos/CrearGasto";
import {MarcarPagado} from "../modelos/MarcarPagado";
import {VecinoGastos} from "../modelos/VecinoGastos";

@Injectable({
  providedIn: 'root',
})
export class GastoService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private comunService: ComunService) { }

  listarGastos(idComunidad: number): Observable<Gasto[]> {
    const options = this.comunService.autorizarPeticion();
    return this.http.get<Gasto[]>(`${this.apiUrl}/vecino/listar/gastos/${idComunidad}`, options)
  }

  listarGastosComunidad(idComunidad: number): Observable<Gasto[]> {
    const options = this.comunService.autorizarPeticion();
    return this.http.get<Gasto[]>(`${this.apiUrl}/comunidad/listar/gastos/${idComunidad}`, options)
  }

  verGasto(idGasto: number): Observable<Gasto> {
    const options = this.comunService.autorizarPeticion();
    return this.http.get<Gasto>(`${this.apiUrl}/vecino/ver/gasto/${idGasto}`, options)
  }

  crearGasto(crearGasto: CrearGasto): Observable<any> {
    const options = this.comunService.autorizarPeticion();
    return this.http.post(`${this.apiUrl}/comunidad/crear/gasto`, crearGasto, options);
  }

  calcularPorcentajePagado(idGasto: number): Observable<number> {
    const options = this.comunService.autorizarPeticion();
    return this.http.get<number>(`${this.apiUrl}/calcular/porcentaje/${idGasto}`, options)
  }

  marcarPagado(marcarPagado: MarcarPagado): Observable<any> {
    const options = this.comunService.autorizarPeticion();
    return this.http.post(`${this.apiUrl}/marcar/pagado`, marcarPagado, options);
  }

  listarDeudoresIdComunidad(idComunidad: number): Observable<VecinoGastos[]> {
    const options = this.comunService.autorizarPeticion();
    return this.http.get<VecinoGastos[]>(`${this.apiUrl}/comunidad/listar/deudores/comunidad/${idComunidad}`, options)
  }
}
