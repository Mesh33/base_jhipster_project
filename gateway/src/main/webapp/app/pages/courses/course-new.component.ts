import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Rx';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { Course} from './course.model';
import { CourseService } from './course.service';
import { Organizer, OrganizerService } from '../../entities/organizer';
import { ResponseWrapper } from '../../shared';
import {Principal} from '../../shared/auth/principal.service';

@Component ({
    selector: 'jhi-course-new',
    templateUrl: './course-new.component.html'
})

export class CourseNewComponent implements OnInit {
    course: Course;
    isSaving: boolean;

    organizers: Organizer[];
    dateDp: any;

    constructor(
        private alertService: JhiAlertService,
        private courseService: CourseService,
        private organizerService: OrganizerService,
        private eventManager: JhiEventManager,
        private router: Router,
        private principal: Principal
    ) {
    }

    ngOnInit() {
        this.course = new Course();
        this.isSaving = false;
        this.principal.identity().then((account) => {
            this.course.organizer = account;
        });
        /*
        this.organizerService
            .query({filter: 'race-is-null'})
            .subscribe((res: ResponseWrapper) => {
                if (!this.course.organizer || !this.course.organizer.id) {
                    this.organizers = res.json;
                } else {
                    this.organizerService
                        .find(this.course.organizer.id)
                        .subscribe((subRes: Organizer) => {
                            this.organizers = [subRes].concat(res.json);
                        }, (subRes: ResponseWrapper) => this.onError(subRes.json));
                }
            }, (res: ResponseWrapper) => this.onError(res.json));
        */
    }

    clear() {
        this.router.navigateByUrl('/');
    }

    save() {
        this.isSaving = true;
        if (this.course.id !== undefined) {
            this.subscribeToSaveResponse(
                this.courseService.update(this.course));
        } else {
            this.subscribeToSaveResponse(
                this.courseService.create(this.course));
        }
        this.router.navigateByUrl('/');
    }

    private subscribeToSaveResponse(result: Observable<Course>) {
        result.subscribe((res: Course) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError());
    }

    private onSaveSuccess(result: Course) {
        this.eventManager.broadcast({ name: 'raceListModification', content: 'OK'});
        this.isSaving = false;
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.alertService.error(error.message, null, null);
    }

    trackOrganizerById(index: number, item: Organizer) {
        return item.id;
    }
}
