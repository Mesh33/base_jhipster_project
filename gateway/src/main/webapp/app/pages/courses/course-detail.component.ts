import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { JhiEventManager } from 'ng-jhipster';

import { Course } from './course.model';
import { CourseService } from './course.service';

@Component({
    selector: 'jhi-race-detail',
    templateUrl: './course-detail.component.html'
})
export class CourseDetailComponent implements OnInit, OnDestroy {

    course: Course;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private raceService: CourseService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInRaces();
    }

    load(id) {
        this.raceService.find(id).subscribe((course) => {
            this.course = course;
            console.log(this.course);
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInRaces() {
        this.eventSubscriber = this.eventManager.subscribe(
            'raceListModification',
            (response) => this.load(this.course.id)
        );
    }
}
