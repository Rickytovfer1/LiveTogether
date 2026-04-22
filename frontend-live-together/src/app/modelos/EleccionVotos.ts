export interface EleccionVotos {
  id: number;
  motivo: string;
  fecha: string;
  abierta: boolean;
  totalAFavor: number;
  totalEnContra: number;
  totalAbstencion: number;
}
