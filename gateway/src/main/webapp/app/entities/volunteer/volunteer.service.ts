import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { Volunteer } from './volunteer.model';
import { ResponseWrapper, createRequestOption } from '../../shared';

@Injectable()
export class VolunteerService {

    private resourceUrl = 'microservice1/api/volunteers';
    private resourceSearchUrl = 'microservice1/api/_search/volunteers';

    constructor(private http: Http) { }

    create(volunteer: Volunteer): Observable<Volunteer> {
        const copy = this.convert(volunteer);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    update(volunteer: Volunteer): Observable<Volunteer> {
        const copy = this.convert(volunteer);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    find(id: number): Observable<Volunteer> {
        return this.http.get(`${this.resourceUrl}/${id}`).map((res: Response) => {
            return res.json();
        });
    }

    query(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        return this.http.get(this.resourceUrl, options)
            .map((res: Response) => this.convertResponse(res));
    }

    delete(id: number): Observable<Response> {
        return this.http.delete(`${this.resourceUrl}/${id}`);
    }

    search(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        return this.http.get(this.resourceSearchUrl, options)
            .map((res: any) => this.convertResponse(res));
    }

    private convertResponse(res: Response): ResponseWrapper {
        const jsonResponse = res.json();
        return new ResponseWrapper(res.headers, jsonResponse, res.status);
    }

    private convert(volunteer: Volunteer): Volunteer {
        const copy: Volunteer = Object.assign({}, volunteer);
        return copy;
    }
}
