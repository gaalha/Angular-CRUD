import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpParams, HttpHeaders }  from "@angular/common/http";
import { CONSTANST } from '../utils/constanst';
import { Person } from '../models/Person';

//import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class PersonService {
    loading:boolean = true;

    constructor(
        private router: Router,
        public http:HttpClient
    ) { }

    headers = new HttpHeaders({
        'x-access-token': localStorage.getItem('token')
    });

    getList(order: string, pageSize: number, page: number, search: string) {
        let params = new HttpParams();
        params = params.append('order', order);
        params = params.append('search', search);
        params = params.append('pageSize', pageSize.toString());
        params = params.append('page', page.toString());
        
        return this.http.get<PersonApi>(CONSTANST.routes.person.list, {headers: this.headers, params: params});
    }

    delete(id: number){
        return this.http.delete(
            CONSTANST.routes.person.delete.replace(':id', String(id)),
            { headers: this.headers }
        );
    }

    save(person: Person){
        return this.http
            .post(CONSTANST.routes.person.save,
                {
                    txtName: person.name,
                    txtAge: person.age,
                    txtGender: person.gender,
                    txtPersonId: person.personid
                },
                { headers: this.headers }
        );
    }
}

export interface PersonApi {
    success: boolean,
    data: Person[],
    total: number,
    pageSize: number,
    page: number
}