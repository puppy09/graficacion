import { Component } from '@angular/core';
import { ProyectosService } from '../../services/proyectos/proyectos.service';
import {MatDialog, MatDialogModule} from '@angular/material/dialog'
import { NuevoProyectoComponent } from '../../nuevo-proyecto/nuevo-proyecto.component';
@Component({
  selector: 'app-menu-proyectos',
  standalone: true,
  imports: [],
  templateUrl: './menu-proyectos.component.html',
  styleUrl: './menu-proyectos.component.css'
})
export class MenuProyectosComponent {
    proyectos: any={};
    nombre:any;
    descripcion:any;
   constructor(private proyectosSvc: ProyectosService, private dialog: MatDialog){}
   ngOnInit(){
    this.getProyectos();
   }
   getProyectos(): void{
      this.proyectosSvc.getProyectos().subscribe(
        (data)=>{
          this.proyectos = data;
          console.log(this.proyectos);
        },(error)=>{
          const errorMessage = error.error?.message || 'Error al obtener proyectos';
          console.log(errorMessage);
        }
      )
   }
   OpenModal(){
    const dialogRef = this.dialog.open(NuevoProyectoComponent,{
      width:'400 px'});
   }
}