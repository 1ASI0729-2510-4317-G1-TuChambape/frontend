// src/app/models/user.model.ts
export interface DatosPersonales {
  nombres: string;
  apellidos: string;
  tipoDocumento: string;
  numeroDocumento: string;
  fechaNacimiento: string;
  sexo: string;
  celular: string;
  pais: string;
  ciudad: string;
  direccion: string;
  correoElectronico: string;
  fechaRegistro: string;
}

export interface PreferenciasUsuario {
  categoriaServicio?: string | null;
  ubicacionDistrito?: string | null;
  tipoServicioOfrecido?: string | null;
  anosExperiencia?: string;
  disponibilidad?: string | null;
  valoracionMinima?: number | null;
  presupuestoEstimado?: string | null;
  idiomas?: string[];
}

export interface ConfiguracionCuenta {
  profilePictureUrl?: string;
  username: string;
  emailVerified: boolean;
  facebookConnected: boolean;
  googleConnected: boolean;
  efectosWeb: boolean;
  animacion: boolean;
  permitirUbicacion: boolean;
  listeningExercises: boolean;

}

// Interfaz principal que agrupa todas las demás para el perfil del usuario
export interface UserProfile {
  datosPersonales: DatosPersonales;
  preferencias: PreferenciasUsuario;

}
