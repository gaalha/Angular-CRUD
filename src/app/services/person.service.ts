import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpResponse } from '@angular/common/http';
import { CONSTANST } from '~utils/constanst';
import { Person } from '~app/models/person';
import { Response } from '~models/response';

import { Provider } from '~base/provider';
import { Observable } from 'rxjs';

@Injectable()
export class PersonService implements Provider {
  loading = true;

  constructor(
    private http: HttpClient,
  ) { }

  headers = new HttpHeaders({
    'Authorization': 'JWT ' + localStorage.getItem('token')
  });

  getList(sortActive: string, order: string, pageSize: number, page: number, search: string): Observable<Response> {
    let params = new HttpParams();
    params = params.append('active', sortActive);
    params = params.append('order', order);
    params = params.append('search', search);
    params = params.append('pageSize', pageSize.toString());
    params = params.append('page', page.toString());

    return this.http.get<Response>(
      CONSTANST.routes.person.list,
      { headers: this.headers, params: params }
    );
  }

  delete(id: number): Observable<Response> {
    return this.http.delete<Response>(
      CONSTANST.routes.person.delete.replace(':id', String(id)),
      { headers: this.headers }
    );
  }

  getOne(id: number): Observable<Response> {
    return this.http.get<Response>(
      CONSTANST.routes.person.get.replace(':id', String(id)),
      { headers: this.headers }
    );
  }

  save(person: Person): Observable<Response> {
    return this.http.post<Response>(
      CONSTANST.routes.person.save,
      {
        txtFirstName: person.first_name,
        txtLastName: person.last_name,
        txtAge: person.age,
        txtGender: person.gender,
        id: person.id
      },
      { headers: this.headers }
    );
  }

}
