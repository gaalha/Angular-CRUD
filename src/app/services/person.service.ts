import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { CONSTANST } from '~utils/constanst';
import { Person } from '~models/Person';
import { Response } from '~models/response';

@Injectable()
export class PersonService {
  loading = true;

  constructor(
    private http: HttpClient,
  ) { }

  headers = new HttpHeaders({
    'Authorization': 'JWT ' + localStorage.getItem('token')
  });

  getList(sortActive: string, order: string, pageSize: number, page: number, search: string) {
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

  delete(id: number) {
    return this.http.delete<Response>(
      CONSTANST.routes.person.delete.replace(':id', String(id)),
      { headers: this.headers }
    );
  }

  getOne(id: number) {
    return this.http.get<Response>(
      CONSTANST.routes.person.get.replace(':id', String(id)),
      { headers: this.headers }
    );
  }

  save(person: Person) {
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
