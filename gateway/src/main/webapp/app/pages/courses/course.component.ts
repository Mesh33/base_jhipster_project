import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

import {Course, DeptType} from './course.model';
import { CourseService } from './course.service';

import { ITEMS_PER_PAGE, Principal, ResponseWrapper } from '../../shared';
import { JhiAlertService } from 'ng-jhipster';

@Component({
    selector : 'jhi-page-course',
    templateUrl : './course.component.html'
})

export class CourseComponent implements OnInit {
    courses: Course[];
    currentAccount: any;
    eventSubscriber: Subscription;
    currentSearch: string;
    dateDp: any;
    departements = [
        'toto',
        'titi'
    ]

    constructor(
        private courseService: CourseService,
        private activatedRoute: ActivatedRoute,
        private alertService: JhiAlertService,
        private principal: Principal
    ) {
        this.currentSearch = activatedRoute.snapshot.params['search'] ? activatedRoute.snapshot.params['search'] : '';
    }

    loadAll() {
        if (this.currentSearch) {
            this.courseService.search({
                query: this.currentSearch,
            }).subscribe(
                (res: ResponseWrapper) => this.courses = res.json,
                (res: ResponseWrapper) => this.onError(res.json)
            );
            return;
        }
        this.courseService.query().subscribe(
            (res: ResponseWrapper) => {
                this.courses = res.json;
                this.currentSearch = '';
            },
            (res: ResponseWrapper) => this.onError(res.json)
        );
    }

    search(query) {
        if (!query) {
            return this.clear();
        }
        this.currentSearch = query;
        this.loadAll();
    }

    clear() {
        this.currentSearch = '';
        this.loadAll();
    }
    ngOnInit() {
        this.loadAll();
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
    }

    trackId(index: number, item: Course) {
        return item.id;
    }

    private onError(error) {
        this.alertService.error(error.message, null, null);
    }

}
