import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient }  from "@angular/common/http";
import { CONSTANST } from '../utils/constanst';
import { Person } from '../models/Person';

//table
import {Observable} from 'rxjs/Observable';

@Injectable()
export class PersonService {
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
        var href = '';
        if(filteredVal === undefined || filteredVal === null){
            href = CONSTANST.routes.person.list+'/'+sort+'/'+order+'/'+(page+1);
        }else{
            href = CONSTANST.routes.person.list+'/'+sort+'/'+order+'/'+(page+1)+'/'+filteredVal;
        }
        return this.http.get<PersonApi>(href);
    }

    delete(id:number){
        return this.http.delete(CONSTANST.routes.person.delete.replace(':id', String(id)));
    }

    save(person: Person){
        return this.http.post(CONSTANST.routes.person.save, person);
    }
}

export interface PersonApi {
    data: Person[];
    totalCount: number;
    pageSize: number;
}
