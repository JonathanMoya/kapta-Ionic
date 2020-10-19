import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class DropboxSService {

    constructor(private http: HttpClient) {
        this.login().subscribe(res => {
            console.log(res);
        })
    }

    uploadFile(data: any) {
        let nData = {
            img: data
        }
        console.log('entra2');
        return this.http.post<any>('https://a1cards.com.co/kapta/pruebaJonathanUpload', nData, {observe: 'response'})
    }

    getPokemonInfo() {
        return this.http.get<any>('https://pokeapi.co/api/v2/pokemon/1/');
    }

    login() {
        return this.http.get<any>('https://a1cards.com.co/kapta/pruebaJonathan');
    }
}
