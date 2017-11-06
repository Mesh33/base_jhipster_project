import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { JhiEventManager, JhiParseLinks, JhiPaginationUtil, JhiAlertService } from 'ng-jhipster';

import { Race } from './race.model';
import { RaceService } from './race.service';
import { ITEMS_PER_PAGE, Principal, ResponseWrapper } from '../../shared';
import { PaginationConfig } from '../../blocks/config/uib-pagination.config';

@Component({
    selector: 'jhi-race',
    templateUrl: './race.component.html'
})
export class RaceComponent implements OnInit, OnDestroy {
races: Race[];
    currentAccount: any;
    eventSubscriber: Subscription;
    currentSearch: string;
    dateDp: any;

    constructor(
        private raceService: RaceService,
        private alertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private activatedRoute: ActivatedRoute,
        private principal: Principal
    ) {
        this.currentSearch = activatedRoute.snapshot.params['search'] ? activatedRoute.snapshot.params['search'] : '';
    }

    loadAll() {
        if (this.currentSearch) {
            this.raceService.search({
                query: this.currentSearch,
                }).subscribe(
                    (res: ResponseWrapper) => this.races = res.json,
                    (res: ResponseWrapper) => this.onError(res.json)
                );
            return;
       }
        this.raceService.query().subscribe(
            (res: ResponseWrapper) => {
                this.races = res.json;
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
        this.registerChangeInRaces();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: Race) {
        return item.id;
    }
    registerChangeInRaces() {
        this.eventSubscriber = this.eventManager.subscribe('raceListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.alertService.error(error.message, null, null);
    }
}
