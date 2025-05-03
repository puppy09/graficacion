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
}


// asi esta mi service segun yo esta 