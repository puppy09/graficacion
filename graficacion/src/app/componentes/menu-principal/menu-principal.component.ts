import { Component } from '@angular/core';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import {MatDialog, MatDialogModule} from '@angular/material/dialog'
// import { NuevoProyectoComponent } from '../../nuevo-proyecto/nuevo-proyecto.component';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-menu-principal',
  standalone: true,
  imports: [MatDialogModule],
  templateUrl: './menu-principal.component.html',
  styleUrl: './menu-principal.component.css'
})
export class MenuPrincipalComponent {
  
  constructor(private route: ActivatedRoute, private router: Router, private dialog: MatDialog) {}
  
  iraCU(){
    this.router.navigate(['casosuso']);
  }

  iraClases(){
    this.router.navigate(['clases']);
  }
  iraComponentes(){
    this.router.navigate(['componentes']);
  }
  iraPaquetes(){
    this.router.navigate(['paquetes']);
  }
  iraSecuencias(){
    this.router.navigate(['secuencias']);
  }
  crearProyecto(){
     const dialogRef = this.dialog.open(MenuPrincipalComponent,{
          width:'400 px'});
    
          dialogRef.afterClosed().subscribe(()=>{
            if(1==1){
              this.router.navigate(['proyectos']);
            }
          })
  }
}
