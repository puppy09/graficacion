import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { versiones } from '../../interfaces/versiones/versiones.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VersionesService {

  constructor(private http:HttpClient) { }
   private apiUrl = environment.apiUrl;

    getVersiones(proyecto:any, diagrama:number):Observable<versiones|versiones[]>{
       return this.http.get<versiones|versiones[]>(`${this.apiUrl}/versiones/${proyecto}/${diagrama}`);
    }
   
    postVersiones(proyecto:number, diagrama: number, version:string,contenido:any):Observable<versiones|versiones[]>{
       return this.http.post<versiones|versiones[]>(`${this.apiUrl}/crearversion`, {proyecto, diagrama, version, contenido});
    }
    updateVersion(proyecto: any,diagrama:number, contenido:any):Observable<versiones|versiones[]>{
       return this.http.put<versiones|versiones[]>(`${this.apiUrl}/version/${proyecto}/${diagrama}`,{contenido});
    }

    getVersion(version:any):Observable<versiones>{
      return this.http.get<versiones>(`${this.apiUrl}/version/${version}`);
    }
}
