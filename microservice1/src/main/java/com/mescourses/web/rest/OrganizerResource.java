package com.mescourses.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.mescourses.domain.Organizer;

import com.mescourses.repository.OrganizerRepository;
import com.mescourses.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing Organizer.
 */
@RestController
@RequestMapping("/api")
public class OrganizerResource {

    private final Logger log = LoggerFactory.getLogger(OrganizerResource.class);

    private static final String ENTITY_NAME = "organizer";

    private final OrganizerRepository organizerRepository;

    public OrganizerResource(OrganizerRepository organizerRepository) {
        this.organizerRepository = organizerRepository;
    }

    /**
     * POST  /organizers : Create a new organizer.
     *
     * @param organizer the organizer to create
     * @return the ResponseEntity with status 201 (Created) and with body the new organizer, or with status 400 (Bad Request) if the organizer has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/organizers")
    @Timed
    public ResponseEntity<Organizer> createOrganizer(@Valid @RequestBody Organizer organizer) throws URISyntaxException {
        log.debug("REST request to save Organizer : {}", organizer);
        if (organizer.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "idexists", "A new organizer cannot already have an ID")).body(null);
        }
        Organizer result = organizerRepository.save(organizer);
        return ResponseEntity.created(new URI("/api/organizers/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /organizers : Updates an existing organizer.
     *
     * @param organizer the organizer to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated organizer,
     * or with status 400 (Bad Request) if the organizer is not valid,
     * or with status 500 (Internal Server Error) if the organizer couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/organizers")
    @Timed
    public ResponseEntity<Organizer> updateOrganizer(@Valid @RequestBody Organizer organizer) throws URISyntaxException {
        log.debug("REST request to update Organizer : {}", organizer);
        if (organizer.getId() == null) {
            return createOrganizer(organizer);
        }
        Organizer result = organizerRepository.save(organizer);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, organizer.getId().toString()))
            .body(result);
    }

    /**
     * GET  /organizers : get all the organizers.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of organizers in body
     */
    @GetMapping("/organizers")
    @Timed
    public List<Organizer> getAllOrganizers() {
        log.debug("REST request to get all Organizers");
        return organizerRepository.findAll();
        }

    /**
     * GET  /organizers/:id : get the "id" organizer.
     *
     * @param id the id of the organizer to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the organizer, or with status 404 (Not Found)
     */
    @GetMapping("/organizers/{id}")
    @Timed
    public ResponseEntity<Organizer> getOrganizer(@PathVariable Long id) {
        log.debug("REST request to get Organizer : {}", id);
        Organizer organizer = organizerRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(organizer));
    }

    /**
     * DELETE  /organizers/:id : delete the "id" organizer.
     *
     * @param id the id of the organizer to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/organizers/{id}")
    @Timed
    public ResponseEntity<Void> deleteOrganizer(@PathVariable Long id) {
        log.debug("REST request to delete Organizer : {}", id);
        organizerRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
