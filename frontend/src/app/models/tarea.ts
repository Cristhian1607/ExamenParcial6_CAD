export type EstadoTarea = 'Pendiente' | 'Completada';

export interface Tarea {
  id: string;
  titulo: string;
  descripcion: string;
  fechaLimite: string;
  prioridad: number;
  estado: EstadoTarea;
}

export interface TareaInput {
  titulo: string;
  descripcion: string;
  fechaLimite: string;
  prioridad: number;
  estado: EstadoTarea;
}
