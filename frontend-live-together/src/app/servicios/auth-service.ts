import { Injectable } from '@angular/core';
import {Login} from "../modelos/Login";
import {BehaviorSubject, Observable} from "rxjs";
import {RegistrarVecino} from "../modelos/RegistrarVecino";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {RegistrarComunidad} from "../modelos/RegistrarComunidad";

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  private authState = new BehaviorSubject<boolean>(!!sessionStorage.getItem('authToken'));
  authState$ = this.authState.asObservable();

  datosRegistro: Login = {
    correo: "",
    contrasena: ""
  };

  constructor(private http: HttpClient) { }

  setDatos(datos: Login) {
    this.datosRegistro = datos;
  }

  getDatos() {
    return this.datosRegistro;
  }

  setAuthState(isAuthenticated: boolean): void {
    this.authState.next(isAuthenticated);
  }

  login(login: Login): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/autorizacion/login`, login);
  }

  registroVecino(registroVecino: RegistrarVecino): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/autorizacion/registro/vecino`, registroVecino);
  }

  registroComunidad(registroComunidad: RegistrarComunidad): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/autorizacion/registro/comunidad`, registroComunidad);
  }

}
