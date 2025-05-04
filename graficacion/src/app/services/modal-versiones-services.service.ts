import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environments';
import { ProyectosService } from './proyectos/proyectos.service';
import { modalVersion } from '../interfaces/modalVersion/modalVersion.interface';
@Injectable({
  providedIn: 'root'
})
export class ModalVersionesServicesService {

  // constructor() { }
   constructor(private http:HttpClient) { }
     private apiUrl = environment.apiUrl;

      getVersiones(proyecto:any):Observable<modalVersion|modalVersion[]>{
        console.log("proyecto");
         return this.http.get<modalVersion|modalVersion[]>(`${this.apiUrl}/versiones/${proyecto}`);
      }
      postVersiones(id_proyecto:any, dia_secuencias:any, dia_componentes:any,dia_cu:any,dia_paquetes:any, dia_clases:any):Observable<any>{
        console.log("id_proyecto");
        console.log(id_proyecto);
        console.log(dia_secuencias);
        console.log(dia_componentes);
        console.log(dia_cu);
        console.log(dia_paquetes);
        console.log(dia_clases);
        console.log("id_proyecto");
        return this.http.post<any>(`${this.apiUrl}/crear/proyecto/bp`, {id_proyecto, dia_secuencias, dia_componentes,dia_cu,dia_paquetes,dia_clases});
      }
}


// asi esta mi service segun yo esta
