// src/app/components/client/my-profile/profile-preferencias/profile-preferencias.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UserProfileDataService, MiPerfilState } from '../../../../services/user-profile-data.service';
import { PreferenciasUsuario } from '../../../../models/user.model';

@Component({
  selector: 'app-profile-preferencias',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './profile-preferencias.component.html',
  styleUrls: ['./profile-preferencias.component.css']
})
export class ProfilePreferenciasComponent implements OnInit, OnDestroy {
  preferenciasForm!: FormGroup;
  private userProfileSubscription: Subscription | undefined;

  // Opciones para los selects y checkboxes
  categoriasServicio: string[] = ['Desarrollo Web', 'Diseño Gráfico', 'Marketing Digital', 'Redacción', 'Consultoría'];
  ubicacionesDistrito: string[] = ['Miraflores', 'San Isidro', 'Surco', 'La Molina', 'Barranco', 'Otro'];
  tiposServicio: string[] = ['Por proyecto', 'Por horas', 'Retainer mensual'];
  anosExperienciaOptions: string[] = ['0-2', '3-5', '6-10', '10+'];
  disponibilidadOptions: string[] = ['Tiempo completo', 'Medio tiempo', 'Fines de semana', 'Flexible'];
  valoracionMinimaOptions: number[] = [1, 2, 3, 4, 5];
  idiomasDisponibles: { id: string, nombre: string }[] = [
    { id: 'espanol', nombre: 'Español' },
    { id: 'ingles', nombre: 'Inglés' },
    { id: 'portugues', nombre: 'Portugués' },
    { id: 'otro', nombre: 'Otro' }
  ];

  constructor(
    private fb: FormBuilder,
    private userProfileDataService: UserProfileDataService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadUserPreferencias();
  }

  initForm(preferencias?: PreferenciasUsuario): void {
    this.preferenciasForm = this.fb.group({
      categoriaServicio: [preferencias?.categoriaServicio || null],
      ubicacionDistrito: [preferencias?.ubicacionDistrito || null],
      tipoServicioOfrecido: [preferencias?.tipoServicioOfrecido || null],
      anosExperiencia: [preferencias?.anosExperiencia || this.anosExperienciaOptions[0]], // Valor por defecto
      disponibilidad: [preferencias?.disponibilidad || null],
      valoracionMinima: [preferencias?.valoracionMinima || null],
      presupuestoEstimado: [preferencias?.presupuestoEstimado || ''],
      idiomas: this.buildIdiomasFormArray(preferencias?.idiomas || [])
    });
  }

  buildIdiomasFormArray(selectedIdiomas: string[]): FormArray {
    const arr = this.idiomasDisponibles.map(idioma => {
      return this.fb.control(selectedIdiomas.some(sel => sel.toLowerCase() === idioma.nombre.toLowerCase()));
    });
    return this.fb.array(arr);
  }

  get idiomasFormArray(): FormArray {
    return this.preferenciasForm.get('idiomas') as FormArray;
  }

  loadUserPreferencias(): void {
    this.userProfileSubscription = this.userProfileDataService.miPerfilState$.subscribe(
      (state: MiPerfilState) => {
        if (this.preferenciasForm) {
          this.preferenciasForm.patchValue(state.preferencias);
          // Para el FormArray de idiomas
          if (state.preferencias.idiomas) {
            this.idiomasFormArray.controls.forEach((control, i) => {
              const idiomaNombre = this.idiomasDisponibles[i].nombre;
              control.setValue(state.preferencias.idiomas!.some(sel => sel.toLowerCase() === idiomaNombre.toLowerCase()));
            });
          }
        } else {
          this.initForm(state.preferencias);
        }
      }
    );
  }

  onSubmit(): void {
    if (this.preferenciasForm.valid) {
      const formValues = this.preferenciasForm.value;
      const selectedIdiomas = this.idiomasDisponibles
        .filter((idioma, index) => formValues.idiomas[index])
        .map(idioma => idioma.nombre);

      const preferenciasAGuardar: PreferenciasUsuario = {
        ...formValues,
        idiomas: selectedIdiomas
      };

      console.log('Formulario de Preferencias Válido:', preferenciasAGuardar);
      this.userProfileDataService.updatePreferenciasUsuario(preferenciasAGuardar);
      alert('Preferencias actualizadas (simulado)!');
    } else {
      console.log('Formulario de Preferencias Inválido');
      this.preferenciasForm.markAllAsTouched();
    }
  }

  ngOnDestroy(): void {
    if (this.userProfileSubscription) {
      this.userProfileSubscription.unsubscribe();
    }
  }
}
