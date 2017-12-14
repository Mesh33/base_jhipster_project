import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { JhiDateUtils } from 'ng-jhipster';

import { Course } from './course.model';
import { ResponseWrapper, createRequestOption, createCustomRequestOption } from '../../shared';

@Injectable()
export class CourseService {

    private resourceUrl = 'microservice1/api/races';
    private resourceSearchUrl = 'microservice1/api/races/_search';
    private resourceOrgaUrl = 'microservice1/api/races/_organizer';

    constructor(private http: Http, private dateUtils: JhiDateUtils) { }

    create(course: Course): Observable<Course> {
        const copy = this.convert(course);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            this.convertItemFromServer(jsonResponse);
            return jsonResponse;
        });
    }

    update(course: Course): Observable<Course> {
        const copy = this.convert(course);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            this.convertItemFromServer(jsonResponse);
            return jsonResponse;
        });
    }

    find(id: number): Observable<Course> {
        return this.http.get(`${this.resourceUrl}/${id}`).map((res: Response) => {
            const jsonResponse = res.json();
            this.convertItemFromServer(jsonResponse);
            return jsonResponse;
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
        this.convertQuery(req);
        const options = createCustomRequestOption(req);
        return this.http.get(this.resourceSearchUrl, options)
            .map((res: any) => this.convertResponse(res));
    }

    getOrganised(req?: any): Observable<ResponseWrapper> {
        this.convertQuery(req);
        const options = createCustomRequestOption(req);
        return this.http.get(this.resourceOrgaUrl, options)
            .map((res: any) => this.convertResponse(res));
    }

    private convertResponse(res: Response): ResponseWrapper {
        const jsonResponse = res.json();
        for (let i = 0; i < jsonResponse.length; i++) {
            this.convertItemFromServer(jsonResponse[i]);
        }
        return new ResponseWrapper(res.headers, jsonResponse, res.status);
    }

    private convertItemFromServer(entity: any) {
        entity.date = this.dateUtils
            .convertLocalDateFromServer(entity.date);
    }

    private convert(course: Course): Course {
        const copy: Course = Object.assign({}, course);
        copy.date = this.dateUtils
            .convertLocalDateToServer(course.date);
        return copy;
    }

    private convertQuery(query: any) {
        query.date = this.dateUtils.convertLocalDateToServer(query.date);
    }
}
