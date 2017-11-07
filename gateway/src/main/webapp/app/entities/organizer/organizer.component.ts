import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { JhiEventManager, JhiParseLinks, JhiPaginationUtil, JhiAlertService } from 'ng-jhipster';

import { Organizer } from './organizer.model';
import { OrganizerService } from './organizer.service';
import { ITEMS_PER_PAGE, Principal, ResponseWrapper } from '../../shared';
import { PaginationConfig } from '../../blocks/config/uib-pagination.config';

@Component({
    selector: 'jhi-organizer',
    templateUrl: './organizer.component.html'
})
export class OrganizerComponent implements OnInit, OnDestroy {
organizers: Organizer[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        private organizerService: OrganizerService,
        private alertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private principal: Principal
    ) {
    }

    loadAll() {
        this.organizerService.query().subscribe(
            (res: ResponseWrapper) => {
                this.organizers = res.json;
            },
            (res: ResponseWrapper) => this.onError(res.json)
        );
    }
    ngOnInit() {
        this.loadAll();
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.registerChangeInOrganizers();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: Organizer) {
        return item.id;
    }
    registerChangeInOrganizers() {
        this.eventSubscriber = this.eventManager.subscribe('organizerListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.alertService.error(error.message, null, null);
    }
}
