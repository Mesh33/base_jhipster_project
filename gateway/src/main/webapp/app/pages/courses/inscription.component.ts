import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { Principal } from '../../shared/auth/principal.service';

import { Course } from './course.model';
import { CourseService } from './course.service';

@Component({
    selector: 'jhi-inscription',
    templateUrl: './inscription.component.html',
    styles: []
})
export class InscriptionComponent implements OnInit, OnDestroy {

    public course: Course;
    public accepted: boolean;
    private subscription: Subscription;

    constructor(
        private courseService: CourseService,
        private principal: Principal,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.accepted = false;
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    load(id) {
        this.courseService.find(id).subscribe((course) => {
            this.course = course;
            console.log(this.course);
        });
    }

    previousState() {
        window.history.back();
    }

    accept() {
        this.accepted = true;
    }
}
