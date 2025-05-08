import { VersionesService } from './../../../services/versiones/versiones.service';
import { modalVersion } from './../../../interfaces/modalVersion/modalVersion.interface';
import { Component } from '@angular/core';
import { ModalVersionesServicesService } from '../../../services/modal-versiones-services.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProyectosService } from '../../../services/proyectos/proyectos.service';
import { BoilerService } from '../../../services/boiler/boiler.service';
import { Toast, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-version-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './version-modal.component.html',
  styleUrl: './version-modal.component.css',

})
export class VersionModalComponent {
allVersiones: any;
diagramas: any= ["diagrama de clases", "diagrama de componentes", "diagrama de paquetes", "diagrama de secuencias", "diagrama de casos de uso"];
versionesSelected: Number[] = [];
bddHost = '';
bddUser = '';
bddPass = '';
nombrePro = '';
graphModel = {}; // tu modelo GraphLinksModel
paquetesGraph = {}; // tu modelo de paquetes
constructor(private modlv: ModalVersionesServicesService, private verSvc: VersionesService, private proSvc: ProyectosService, private boilerSvc: BoilerService, private toastr: ToastrService) { }
// constructor(private modlv: modalVersion) { }
ngOnInit(){
  this.getVersiones();
  console.log("versiones");
  console.log(this.allVersiones);
  console.log("versiones");



}
  SubmitVersion(){
    const id_proyecto = localStorage.getItem("proyectoId");
    if (!id_proyecto) {
      console.error('No se encontró el ID del proyecto en localStorage');
      return;
    }
    //console.log("id_proyecto");
    //console.log(id_proyecto);
    //console.log(this.versionesSelected);
    
    //Obtenemos los Componentes
    this.verSvc.getJson(this.versionesSelected[1]).subscribe((data)=>{
      //console.log(data);
      localStorage.setItem("componentes",JSON.stringify(data.json));
    })

    //Obtenemos los Paquetes
    this.verSvc.getJson(this.versionesSelected[2]).subscribe((data)=>{
     // console.log(data);
      localStorage.setItem("paquetes",JSON.stringify(data.json));
    })

    //Obtenemos las Clases
    this.verSvc.getJson(this.versionesSelected[0]).subscribe((data)=>{
      //console.log(data);
      localStorage.setItem("clases",JSON.stringify(data.json))
    })

    this.proSvc.getProyecto(localStorage.getItem("proyectoId")).subscribe((data)=>{
     this.nombrePro=data.nombre;
      console.log(data);
      //console.log(this.nombrePro);
      
    })

    const credenciales={
      "bddHost":this.bddHost,
      "bddUser":this.bddUser,
      "bddPass":this.bddPass
    }
      //console.log("peticionooooo",peticion);
      const peticion={
        "nombreProyecto":this.nombrePro,
        "credenciales":{

          },
          "graphModel":localStorage.getItem("clases"),
          "paquetesGraph":localStorage.getItem("paquetes")
        }
        localStorage.setItem("peticion",JSON.stringify(peticion));
        //const peticionBien = localStorage.getItem("peticion")

    this.boilerSvc.hacerBoiler(this.nombrePro,credenciales,localStorage.getItem("clases"),localStorage.getItem("paquetes")).subscribe(
      (data)=>{
        this.toastr.success('Creando Proyecto...!', 'Nice!');
      }
    )

    /*this.modlv.postVersiones(id_proyecto, this.versionesSelected[3],this.versionesSelected[1],
      this.versionesSelected[4],this.versionesSelected[2],this.versionesSelected[0], this.bddHost, this.bddUser, this.bddPass

    ).subscribe(
      (data) => {
        console.log("versiones");
        console.log("proyecto creado");
        console.log(data);
        this.allVersiones = data;
        console.log(this.allVersiones);
      },
      (error) => {
        const errorMessage = error.error?.message || 'Error al obtener versiones';
        console.log("tuve un error");
        console.log(errorMessage);
      }
    );*/

  }

  getVersiones(): void{
    const id_proyecto = localStorage.getItem("proyectoId");
    if (!id_proyecto) {
      console.error('No se encontró el ID del proyecto en localStorage');
      return;
    }
    console.log("id_proyecto");
    this.modlv.getVersiones(id_proyecto).subscribe(
      (data) => {
        console.log("versiones");
        this.allVersiones = data;
        console.log(this.allVersiones);
      },
      (error) => {
        const errorMessage = error.error?.message || 'Error al obtener versiones';
        console.log("tuve un error");
        console.log(errorMessage);
      }
    );

  }
}
