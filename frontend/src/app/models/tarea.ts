/** Estados permitidos por la API para una tarea. */
export type EstadoTarea = 'Pendiente' | 'Completada';

/** Tarea recibida desde el backend. */
export interface Tarea {
  id: string;
  titulo: string;
  descripcion: string;
  fechaLimite: string;
  prioridad: number;
  estado: EstadoTarea;
}

/** Campos que se envían al crear o actualizar una tarea. */
export interface TareaInput {
  titulo: string;
  descripcion: string;
  fechaLimite: string;
  prioridad: number;
  estado: EstadoTarea;
}
