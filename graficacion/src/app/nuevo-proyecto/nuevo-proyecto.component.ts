import { Component } from '@angular/core';
import {FormControl, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';
import { ProyectosService } from '../services/proyectos/proyectos.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialogActions, MatDialogRef } from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatDialogContent } from '@angular/material/dialog';
import { VersionesService } from '../services/versiones/versiones.service';
import { Router } from '@angular/router';

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
 

  constructor(private router: Router, private verSvc: VersionesService, private dialogRef: MatDialogRef<NuevoProyectoComponent>, private proyectosSvc: ProyectosService, private toastr: ToastrService){}

/*Hola*/
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
      const newProjectID = response.id_proyecto;
      this.dialogRef.close(newProjectID);
      this.crearVersiones(newProjectID);
      console.log("ID DEL PROYECTO CREADO", newProjectID);
     // this.router.navigate(['proyectos']);


    
     
    });
  }
  crearVersiones(proyecto: number){
    const initialVersion = "1.0 - Version Inicial";
      const defaultJson = {  "class": "GraphLinksModel", "nodeDataArray": [
      {"key":"Sistema","isGroup":true}
      ] }; // customize as needed
      
      const diagramas = [
        { id_diagrama: 1 },
        { id_diagrama: 2 },
        { id_diagrama: 3 },
        { id_diagrama: 4 },
        { id_diagrama: 5 }
      ];
      diagramas.forEach(diagrama => {
        this.verSvc.postVersiones(proyecto, diagrama.id_diagrama, initialVersion, defaultJson)
          .subscribe(() => {
            console.log(`Versión inicial creada para ${diagrama}`);
          });
      });

  }
  onClose(){
    this.dialogRef.close();
  }
}
