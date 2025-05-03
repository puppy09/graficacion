import { VersionesService } from './../../../services/versiones/versiones.service';
import { modalVersion } from './../../../interfaces/modalVersion/modalVersion.interface';
import { Component } from '@angular/core';
import { ModalVersionesServicesService } from '../../../services/modal-versiones-services.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
constructor(private modlv: ModalVersionesServicesService) { }
// constructor(private modlv: modalVersion) { }
ngOnInit(){
  this.getVersiones();
  console.log("versiones");
  console.log(this.allVersiones);
  console.log("versiones");



}
  SubmitVersion(){
    console.log(this.versionesSelected);

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
