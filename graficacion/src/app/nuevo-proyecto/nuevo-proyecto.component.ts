import { Component } from '@angular/core';
import {FormControl, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';
import { ProyectosService } from '../services/proyectos/proyectos.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialogActions, MatDialogRef } from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatDialogContent } from '@angular/material/dialog';

@Component({
  selector: 'app-nuevo-proyecto',
  standalone: true,
  imports: [ReactiveFormsModule, MatDialogActions, MatFormFieldModule, MatDialogContent],
  templateUrl: './nuevo-proyecto.component.html',
  styleUrl: './nuevo-proyecto.component.css'
})
export class NuevoProyectoComponent {

  nuevoProyecto: FormGroup = new FormGroup({});
  nombre: any;
  descripcion: any;
 

  constructor( private dialogRef: MatDialogRef<NuevoProyectoComponent>, private proyectosSvc: ProyectosService, private toastr: ToastrService){}


  ngOnInit(){
    this.nuevoProyecto = new FormGroup({
        nombre: new FormControl('',Validators.required),
        descripcion: new FormControl('', Validators.required)
    });
  }

  onSubmit(){
    const formData = this.nuevoProyecto.value;
    this.proyectosSvc.postProyectos(
      formData.nombre,
      formData.descripcion
    ).subscribe(response =>{
      this.toastr.success('Proyecto Creado con Éxito', 'Nice!');
    })
  }

  onClose(){
    this.dialogRef.close();
  }
}
