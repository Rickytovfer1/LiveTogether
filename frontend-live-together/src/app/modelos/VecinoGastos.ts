import {Gasto} from "./Gasto";

export interface VecinoGastos {
  id: number;
  nombre: string;
  apellidos: string;
  telefono: string;
  fechaNacimiento: string;
  numeroCuenta: string;
  dni: string;
  fotoPerfil?: string
  gastosPagados: Gasto[];
  gastosPendientes: Gasto[];
}
