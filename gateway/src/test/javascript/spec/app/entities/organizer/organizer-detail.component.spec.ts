/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
import { OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { JhiDateUtils, JhiDataUtils, JhiEventManager } from 'ng-jhipster';
import { GatewayTestModule } from '../../../test.module';
import { MockActivatedRoute } from '../../../helpers/mock-route.service';
import { OrganizerDetailComponent } from '../../../../../../main/webapp/app/entities/organizer/organizer-detail.component';
import { OrganizerService } from '../../../../../../main/webapp/app/entities/organizer/organizer.service';
import { Organizer } from '../../../../../../main/webapp/app/entities/organizer/organizer.model';

describe('Component Tests', () => {

    describe('Organizer Management Detail Component', () => {
        let comp: OrganizerDetailComponent;
        let fixture: ComponentFixture<OrganizerDetailComponent>;
        let service: OrganizerService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [GatewayTestModule],
                declarations: [OrganizerDetailComponent],
                providers: [
                    JhiDateUtils,
                    JhiDataUtils,
                    DatePipe,
                    {
                        provide: ActivatedRoute,
                        useValue: new MockActivatedRoute({id: 123})
                    },
                    OrganizerService,
                    JhiEventManager
                ]
            }).overrideTemplate(OrganizerDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(OrganizerDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(OrganizerService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
            // GIVEN

            spyOn(service, 'find').and.returnValue(Observable.of(new Organizer(10)));

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.find).toHaveBeenCalledWith(123);
            expect(comp.organizer).toEqual(jasmine.objectContaining({id: 10}));
            });
        });
    });

});
