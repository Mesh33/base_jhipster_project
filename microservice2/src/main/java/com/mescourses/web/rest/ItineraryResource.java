package com.mescourses.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.mescourses.domain.Itinerary;

import com.mescourses.repository.ItineraryRepository;
import com.mescourses.web.rest.errors.BadRequestAlertException;
import com.mescourses.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing Itinerary.
 */
@RestController
@RequestMapping("/api")
public class ItineraryResource {

    private final Logger log = LoggerFactory.getLogger(ItineraryResource.class);

    private static final String ENTITY_NAME = "itinerary";

    private final ItineraryRepository itineraryRepository;

    public ItineraryResource(ItineraryRepository itineraryRepository) {
        this.itineraryRepository = itineraryRepository;
    }

    /**
     * POST  /itineraries : Create a new itinerary.
     *
     * @param itinerary the itinerary to create
     * @return the ResponseEntity with status 201 (Created) and with body the new itinerary, or with status 400 (Bad Request) if the itinerary has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/itineraries")
    @Timed
    public ResponseEntity<Itinerary> createItinerary(@RequestBody Itinerary itinerary) throws URISyntaxException {
        log.debug("REST request to save Itinerary : {}", itinerary);
        if (itinerary.getId() != null) {
            throw new BadRequestAlertException("A new itinerary cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Itinerary result = itineraryRepository.save(itinerary);
        return ResponseEntity.created(new URI("/api/itineraries/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /itineraries : Updates an existing itinerary.
     *
     * @param itinerary the itinerary to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated itinerary,
     * or with status 400 (Bad Request) if the itinerary is not valid,
     * or with status 500 (Internal Server Error) if the itinerary couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/itineraries")
    @Timed
    public ResponseEntity<Itinerary> updateItinerary(@RequestBody Itinerary itinerary) throws URISyntaxException {
        log.debug("REST request to update Itinerary : {}", itinerary);
        if (itinerary.getId() == null) {
            return createItinerary(itinerary);
        }
        Itinerary result = itineraryRepository.save(itinerary);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, itinerary.getId().toString()))
            .body(result);
    }

    /**
     * GET  /itineraries : get all the itineraries.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of itineraries in body
     */
    @GetMapping("/itineraries")
    @Timed
    public List<Itinerary> getAllItineraries() {
        log.debug("REST request to get all Itineraries");
        return itineraryRepository.findAll();
        }

    /**
     * GET  /itineraries/:id : get the "id" itinerary.
     *
     * @param id the id of the itinerary to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the itinerary, or with status 404 (Not Found)
     */
    @GetMapping("/itineraries/{id}")
    @Timed
    public ResponseEntity<Itinerary> getItinerary(@PathVariable Long id) {
        log.debug("REST request to get Itinerary : {}", id);
        Itinerary itinerary = itineraryRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(itinerary));
    }

    /**
     * DELETE  /itineraries/:id : delete the "id" itinerary.
     *
     * @param id the id of the itinerary to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/itineraries/{id}")
    @Timed
    public ResponseEntity<Void> deleteItinerary(@PathVariable Long id) {
        log.debug("REST request to delete Itinerary : {}", id);
        itineraryRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
    
    /**
     * GET  /itineraries/:raceid : get the "raceid" itinerary.
     *
     * @param raceid the id of the race whose itinerary is to be retrieved
     * @return the ResponseEntity with status 200 (OK) and with body the itinerary, or with status 404 (Not Found)
     */
    @GetMapping("/itineraries/customMapping/{raceid}")
    @Timed
    public ResponseEntity<Itinerary> getItineraryRace(@PathVariable Integer raceid) {
        log.debug("REST request to get Itinerary : {}", raceid);
        Itinerary itinerary = itineraryRepository.findByRaceid(raceid).get(0);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(itinerary));
    }
}
