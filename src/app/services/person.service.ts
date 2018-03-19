import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpParams, HttpHeaders }  from "@angular/common/http";
import { CONSTANST } from '../utils/constanst';
import { Person } from '../models/Person';

import { Observable } from 'rxjs/Observable';

const headers = new HttpHeaders({
    'x-access-token': localStorage.getItem('token')
});

@Injectable()
export class PersonService {
    loading:boolean = true;

    constructor(
        private router: Router,
        public http:HttpClient
    ) {  }

    getList(
        sort: string,
        order: string,
        page: number,
        filteredVal: any
    ):Observable<PersonApi> {
        return this.http.get<PersonApi>(CONSTANST.routes.person.list, {headers: headers});
    }

    delete(id:number){
        return this.http.delete(
            CONSTANST.routes.person.delete.replace(':id', String(id)),
            { headers: headers }
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
                { headers: headers }
        );
    }
}

export interface PersonApi {
    data: Person[];
    totalCount: number;
    pageSize: number;
}