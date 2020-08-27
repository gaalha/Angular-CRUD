import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { CONSTANST } from '~utils/constanst';
import { Client } from '~app/models/client';
import { Response } from '~app/models/response';

import { Provider } from '~base/provider';
import { Observable } from 'rxjs';

@Injectable()
export class ClientService implements Provider {
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
      CONSTANST.routes.client.list,
      { headers: this.headers, params: params }
    );
  }

  delete(id: number): Observable<Response> {
    return this.http.delete<Response>(
      CONSTANST.routes.client.delete.replace(':id', String(id)),
      { headers: this.headers }
    );
  }

  getOne(id: number): Observable<Response> {
    return this.http.get<Response>(
      CONSTANST.routes.client.get.replace(':id', String(id)),
      { headers: this.headers }
    );
  }

  save(client: Client): Observable<Response> {
    return this.http.post<Response>(
      CONSTANST.routes.client.save,
      {
        txtFirstName: client.first_name,
        txtLastName: client.last_name,
        txtAge: client.age,
        txtGender: client.gender,
        id: client.id
      },
      { headers: this.headers }
    );
  }

}
