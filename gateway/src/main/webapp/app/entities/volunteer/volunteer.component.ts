import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { JhiEventManager, JhiParseLinks, JhiPaginationUtil, JhiAlertService } from 'ng-jhipster';

import { Volunteer } from './volunteer.model';
import { VolunteerService } from './volunteer.service';
import { ITEMS_PER_PAGE, Principal, ResponseWrapper } from '../../shared';
import { PaginationConfig } from '../../blocks/config/uib-pagination.config';

@Component({
    selector: 'jhi-volunteer',
    templateUrl: './volunteer.component.html'
})
export class VolunteerComponent implements OnInit, OnDestroy {
volunteers: Volunteer[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        private volunteerService: VolunteerService,
        private alertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private principal: Principal
    ) {
    }

    loadAll() {
        this.volunteerService.query().subscribe(
            (res: ResponseWrapper) => {
                this.volunteers = res.json;
            },
            (res: ResponseWrapper) => this.onError(res.json)
        );
    }
    ngOnInit() {
        this.loadAll();
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.registerChangeInVolunteers();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: Volunteer) {
        return item.id;
    }
    registerChangeInVolunteers() {
        this.eventSubscriber = this.eventManager.subscribe('volunteerListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.alertService.error(error.message, null, null);
    }
}
