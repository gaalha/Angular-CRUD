import { Person } from '~models/person';
import { Response } from '~models/response';
import { Observable } from 'rxjs';

export abstract class Provider {

  constructor() { }

  abstract getList(sortActive: string, order: string, pageSize: number, page: number, search: string): Observable<Response>;

  abstract getOne(id: number): Observable<Response>;

  abstract save(person: Person): Observable<Response>;

  abstract delete(id: number): Observable<Response>;

}
