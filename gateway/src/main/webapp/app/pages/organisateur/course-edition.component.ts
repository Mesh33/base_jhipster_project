import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';
import { Subscription } from 'rxjs/Rx';

import { Observable } from 'rxjs/Rx';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { Course } from '../courses/course.model';
import { CourseService } from '../courses/course.service';
import { ResponseWrapper } from '../../shared';

@Component({
    selector: 'jhi-course-edition',
    templateUrl: './course-edition.component.html'
})
export class CourseEditionComponent implements OnInit {

    course: Course;
    isSaving: boolean;
    private subscription: Subscription;

    dateDp: any;

    constructor(
        private alertService: JhiAlertService,
        private courseService: CourseService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
    }

    save() {
        this.isSaving = true;
        console.log(this.course);
        this.subscribeToSaveResponse(
            this.courseService.update(this.course));
    }

    private subscribeToSaveResponse(result: Observable<Course>) {
        result.subscribe((res: Course) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError());
    }

    private onSaveSuccess(result: Course) {
        this.isSaving = false;
        window.history.back();
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.alertService.error(error.message, null, null);
    }

    load(id) {
        this.courseService.find(id).subscribe((course) => {
            this.course = course;
        });
    }

    previousState() {
        window.history.back();
    }

}
