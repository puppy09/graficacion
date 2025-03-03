import { Component } from '@angular/core';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-menu-principal',
  standalone: true,
  imports: [],
  templateUrl: './menu-principal.component.html',
  styleUrl: './menu-principal.component.css'
})
export class MenuPrincipalComponent {

  constructor(private route: ActivatedRoute, private router: Router){}
  
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
}
