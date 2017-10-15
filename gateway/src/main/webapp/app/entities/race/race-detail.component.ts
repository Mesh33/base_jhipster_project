import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { JhiEventManager } from 'ng-jhipster';

import { Race } from './race.model';
import { RaceService } from './race.service';

@Component({
    selector: 'jhi-race-detail',
    templateUrl: './race-detail.component.html'
})
export class RaceDetailComponent implements OnInit, OnDestroy {

    race: Race;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private raceService: RaceService,
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
        this.raceService.find(id).subscribe((race) => {
            this.race = race;
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
            (response) => this.load(this.race.id)
        );
    }
}
