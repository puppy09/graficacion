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

    getVersiones(proyecto:number, diagrama:number):Observable<versiones|versiones[]>{
       return this.http.get<versiones|versiones[]>(`${this.apiUrl}/versiones/${proyecto}/${diagrama}`);
    }
   
    postVersiones(proyecto:number, diagrama: number, version:string,contenido:JSON):Observable<versiones|versiones[]>{
       return this.http.post<versiones|versiones[]>(`${this.apiUrl}/crearversion`, {proyecto, diagrama, version, contenido});
    }
    updateVersion(proyecto: number,diagrama:number, version: string, contenido:JSON):Observable<versiones|versiones[]>{
       return this.http.put<versiones|versiones[]>(`${this.apiUrl}/version/${proyecto}/${diagrama}`,{version, contenido});
    }
}
