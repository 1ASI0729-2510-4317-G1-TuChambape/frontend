// src/app/components/client/my-profile/profile-datos/profile-datos.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; // Importa para formularios reactivos
import { Subscription } from 'rxjs'; // Para manejar suscripciones
import { UserProfileDataService, MiPerfilState } from '../../../../services/user-profile-data.service';
import { DatosPersonales } from '../../../../models/user.model';

@Component({
  selector: 'app-profile-datos',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './profile-datos.component.html',
  styleUrls: ['./profile-datos.component.css']
})
export class ProfileDatosComponent implements OnInit, OnDestroy {
  datosForm!: FormGroup; // El '!' indica que se inicializará en ngOnInit
  private userProfileSubscription: Subscription | undefined;



  constructor(
    private fb: FormBuilder,
    private userProfileDataService: UserProfileDataService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadUserProfileData();
  }

  initForm(datos?: DatosPersonales): void {
    // Define la estructura del formulario reactivo
    // Los valores iniciales se cargarán desde el servicio
    this.datosForm = this.fb.group({
      nombres: [datos?.nombres || '', Validators.required],
      apellidos: [datos?.apellidos || '', Validators.required],
      tipoDocumento: [datos?.tipoDocumento || 'DNI', Validators.required], // Valor por defecto si es necesario
      numeroDocumento: [datos?.numeroDocumento || '', [Validators.required, Validators.pattern('^[0-9]*$')]],
      fechaNacimiento: [datos?.fechaNacimiento || '', Validators.required], // Considerar un date picker
      sexo: [datos?.sexo || 'Masculino', Validators.required],
      celular: [datos?.celular || '', [Validators.required, Validators.pattern('^[0-9]*$')]],
      pais: [datos?.pais || 'Perú', Validators.required],
      ciudad: [datos?.ciudad || 'Lima', Validators.required],
      direccion: [datos?.direccion || '', Validators.required],
      correoElectronico: [datos?.correoElectronico || '', [Validators.required, Validators.email]],
      fechaRegistro: [{ value: datos?.fechaRegistro || '', disabled: true }] // Campo deshabilitado, solo visualización
    });
  }

  loadUserProfileData(): void {
    this.userProfileSubscription = this.userProfileDataService.miPerfilState$.subscribe(
      (state: MiPerfilState) => {

        // Actualiza los valores del formulario con los datos del servicio
        // Usamos patchValue para que no falle si algún campo no está en el formulario (aunque deberían estar todos)
        if (this.datosForm) { // Asegurarse que el formulario ya está inicializado
          this.datosForm.patchValue(state.datosPersonales);

          this.datosForm.get('fechaRegistro')?.setValue(state.datosPersonales.fechaRegistro);
        } else {
          // Si el formulario no está listo, inicialízalo con los datos
          this.initForm(state.datosPersonales);
        }
      }
    );
  }


  onSubmit(): void {
    if (this.datosForm.valid) {
      console.log('Formulario de Datos Válido:', this.datosForm.value);

      const formDataToSave = this.datosForm.getRawValue(); // getRawValue() incluye campos deshabilitados


      this.userProfileDataService.updateDatosPersonales(formDataToSave as DatosPersonales);

      alert('Datos personales actualizados (simulado)!');
    } else {
      console.log('Formulario de Datos Inválido');
      // Marcar todos los campos como tocados para mostrar mensajes de error si es necesario
      this.datosForm.markAllAsTouched();
    }
  }

  ngOnDestroy(): void {

    if (this.userProfileSubscription) {
      this.userProfileSubscription.unsubscribe();
    }
  }
}
