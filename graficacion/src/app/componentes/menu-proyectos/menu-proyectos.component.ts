import { Component } from '@angular/core';
import { ProyectosService } from '../../services/proyectos/proyectos.service';
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
   constructor(private proyectosSvc: ProyectosService){}
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
   postProyectos():void{

   }
}