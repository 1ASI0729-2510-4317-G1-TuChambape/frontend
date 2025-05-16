// src/app/services/user-profile-data.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DatosPersonales, PreferenciasUsuario, ConfiguracionCuenta } from '../models/user.model';

// Esto es para la vista "Mi Perfil" que tiene "Datos" y "Preferencias"
export interface MiPerfilState {
  datosPersonales: DatosPersonales;
  preferencias: PreferenciasUsuario;
}

@Injectable({
  providedIn: 'root' // Esto hace que el servicio esté disponible en toda la aplicación
})
export class UserProfileDataService {

  // --- Datos Personales y Preferencias (para la vista "Mi Perfil") ---
  private initialMiPerfilState: MiPerfilState = {
    datosPersonales: {
      nombres: "James",
      apellidos: "Cooper",
      tipoDocumento: "DNI",
      numeroDocumento: "77894567",
      fechaNacimiento: "15-08-1997",
      sexo: "Masculino",
      celular: "987568741",
      pais: "Perú",
      ciudad: "Lima",
      direccion: "Av. Primavera 567, Dpto F-104",
      correoElectronico: "janecooper@gmail.com",
      fechaRegistro: "17-04-22"
    },
    preferencias: {
      categoriaServicio: 'Desarrollo Web',
      ubicacionDistrito: 'Miraflores',
      tipoServicioOfrecido: 'Por proyecto',
      anosExperiencia: "10+",           // Valor inicial para el grupo de radio/checkbox
      disponibilidad: 'Tiempo completo',
      valoracionMinima: 4,
      presupuestoEstimado: 'S/ 2000 - S/ 3000',
      idiomas: ["Español", "Inglés"]
    }
  };

  // Usamos BehaviorSubject para que los componentes puedan obtener el valor actual al suscribirse
  private miPerfilState = new BehaviorSubject<MiPerfilState>(this.initialMiPerfilState);

  // Observable público para que los componentes se suscriban
  public miPerfilState$: Observable<MiPerfilState> = this.miPerfilState.asObservable();


  constructor() {
    // Aquí se podra cargar los datos desde un localStorage o una API
    console.log('UserProfileDataService inicializado con datos:', this.initialMiPerfilState);
  }


  // Obtener el estado actual de "Mi Perfil" (Datos y Preferencias)
  public getMiPerfilState(): MiPerfilState {
    return this.miPerfilState.getValue();
  }

  // Actualizar Datos Personales
  public updateDatosPersonales(nuevosDatos: Partial<DatosPersonales>): void {
    const currentState = this.miPerfilState.getValue();
    const updatedState = {
      ...currentState,
      datosPersonales: {
        ...currentState.datosPersonales,
        ...nuevosDatos // Combina los datos actuales con los nuevos
      }
    };
    this.miPerfilState.next(updatedState);
    console.log('Datos Personales actualizados (simulado):', updatedState.datosPersonales);
  }

  // Actualizar Preferencias del Usuario
  public updatePreferenciasUsuario(nuevasPreferencias: Partial<PreferenciasUsuario>): void {
    const currentState = this.miPerfilState.getValue();
    const updatedState = {
      ...currentState,
      preferencias: {
        ...currentState.preferencias,
        ...nuevasPreferencias // Combina las preferencias actuales con las nuevas
      }
    };
    this.miPerfilState.next(updatedState);
    console.log('Preferencias de Usuario actualizadas (simulado):', updatedState.preferencias);
  }


}
