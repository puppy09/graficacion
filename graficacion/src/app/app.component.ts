import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuPrincipalComponent } from "./componentes/menu-principal/menu-principal.component";
import { UmlCasosUsoComponent } from './componentes/uml-casos-uso/uml-casos-uso.component';
import { UmlPaquetesComponent } from './componentes/uml-paquetes/uml-paquetes.component';
import { UmlSecuenciasComponent } from './componentes/uml-secuencias/uml-secuencias.component';
import { UmlClasesComponent } from './componentes/uml-clases/uml-clases.component';
import { UmlComponentesComponent } from './componentes/uml-componentes/uml-componentes.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MenuPrincipalComponent, UmlCasosUsoComponent, UmlPaquetesComponent, UmlSecuenciasComponent, UmlComponentesComponent, UmlClasesComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'graficacion';
}
