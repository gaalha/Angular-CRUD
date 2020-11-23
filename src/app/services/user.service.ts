import { Injectable } from '@angular/core';

import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Provider } from '~base/provider';

import { Observable } from 'rxjs';
import { CONSTANST } from '~utils/constanst';
import { User } from '~app/models/user';
import { Response } from '~app/models/response';

@Injectable()
export class UserService implements Provider {

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
      CONSTANST.routes.user.list,
      { headers: this.headers, params: params }
    );
  }

  getOne(id: number): Observable<Response> {
    return this.http.get<Response>(
      CONSTANST.routes.user.get.replace(':id', String(id)),
      { headers: this.headers }
    );
  }

  save(user: User): Observable<Response> {
    return this.http.post<Response>(
      CONSTANST.routes.user.save,
      {
        user_name: user.user_name,
        email: user.email,
        password: user.password,
        id: user.id
      },
      { headers: this.headers }
    );
  }

  delete(id: number): Observable<Response> {
    return this.http.delete<Response>(
      CONSTANST.routes.user.delete.replace(':id', String(id)),
      { headers: this.headers }
    );
  }

}
