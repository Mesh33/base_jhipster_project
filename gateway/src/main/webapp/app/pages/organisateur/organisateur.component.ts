import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

import { Course, CourseDept, CourseType} from '../courses/course.model';
import { CourseService } from '../courses/course.service';

import { ITEMS_PER_PAGE, Principal, ResponseWrapper } from '../../shared';
import { JhiAlertService } from 'ng-jhipster';

@Component({
    selector : 'jhi-page-organisateur',
    templateUrl : './organisateur.component.html',
    styles: ['dt { font-weight: normal; }']
})

export class OrganisateurComponent implements OnInit {
    courses: Course[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        private courseService: CourseService,
        private activatedRoute: ActivatedRoute,
        private alertService: JhiAlertService,
        private principal: Principal
    ) {}

    getCourses() {
        this.courseService.getOrganised({
            user: this.currentAccount.login,
        }).subscribe(
            (res: ResponseWrapper) => {
                this.courses = res.json;
                this.order();
            },
            (res: ResponseWrapper) => this.onError(res.json)
        );
        return;
    }

    ngOnInit() {
        this.principal.identity().then((account) => {
            this.currentAccount = account;
            this.getCourses();
        });
    }

    trackId(index: number, item: Course) {
        return item.id;
    }

    private onError(error) {
        this.alertService.error(error.message, null, null);
    }

    private order() {
        this.courses.sort(function(a: Course, b: Course) {
            if ( a.date < b.date ) {
                return -1;
            } else if ( a.date > b.date) {
                return 1;
            } else {
                return 0;
            }
        })
    }

}
