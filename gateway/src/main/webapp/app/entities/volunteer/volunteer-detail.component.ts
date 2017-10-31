import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { JhiEventManager } from 'ng-jhipster';

import { Volunteer } from './volunteer.model';
import { VolunteerService } from './volunteer.service';

@Component({
    selector: 'jhi-volunteer-detail',
    templateUrl: './volunteer-detail.component.html'
})
export class VolunteerDetailComponent implements OnInit, OnDestroy {

    volunteer: Volunteer;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private volunteerService: VolunteerService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInVolunteers();
    }

    load(id) {
        this.volunteerService.find(id).subscribe((volunteer) => {
            this.volunteer = volunteer;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInVolunteers() {
        this.eventSubscriber = this.eventManager.subscribe(
            'volunteerListModification',
            (response) => this.load(this.volunteer.id)
        );
    }
}
