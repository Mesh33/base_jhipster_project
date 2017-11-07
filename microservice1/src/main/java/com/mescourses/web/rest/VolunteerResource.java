package com.mescourses.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.mescourses.domain.Volunteer;

import com.mescourses.repository.VolunteerRepository;
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
 * REST controller for managing Volunteer.
 */
@RestController
@RequestMapping("/api")
public class VolunteerResource {

    private final Logger log = LoggerFactory.getLogger(VolunteerResource.class);

    private static final String ENTITY_NAME = "volunteer";

    private final VolunteerRepository volunteerRepository;

    public VolunteerResource(VolunteerRepository volunteerRepository) {
        this.volunteerRepository = volunteerRepository;
    }

    /**
     * POST  /volunteers : Create a new volunteer.
     *
     * @param volunteer the volunteer to create
     * @return the ResponseEntity with status 201 (Created) and with body the new volunteer, or with status 400 (Bad Request) if the volunteer has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/volunteers")
    @Timed
    public ResponseEntity<Volunteer> createVolunteer(@Valid @RequestBody Volunteer volunteer) throws URISyntaxException {
        log.debug("REST request to save Volunteer : {}", volunteer);
        if (volunteer.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "idexists", "A new volunteer cannot already have an ID")).body(null);
        }
        Volunteer result = volunteerRepository.save(volunteer);
        return ResponseEntity.created(new URI("/api/volunteers/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /volunteers : Updates an existing volunteer.
     *
     * @param volunteer the volunteer to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated volunteer,
     * or with status 400 (Bad Request) if the volunteer is not valid,
     * or with status 500 (Internal Server Error) if the volunteer couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/volunteers")
    @Timed
    public ResponseEntity<Volunteer> updateVolunteer(@Valid @RequestBody Volunteer volunteer) throws URISyntaxException {
        log.debug("REST request to update Volunteer : {}", volunteer);
        if (volunteer.getId() == null) {
            return createVolunteer(volunteer);
        }
        Volunteer result = volunteerRepository.save(volunteer);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, volunteer.getId().toString()))
            .body(result);
    }

    /**
     * GET  /volunteers : get all the volunteers.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of volunteers in body
     */
    @GetMapping("/volunteers")
    @Timed
    public List<Volunteer> getAllVolunteers() {
        log.debug("REST request to get all Volunteers");
        return volunteerRepository.findAll();
        }

    /**
     * GET  /volunteers/:id : get the "id" volunteer.
     *
     * @param id the id of the volunteer to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the volunteer, or with status 404 (Not Found)
     */
    @GetMapping("/volunteers/{id}")
    @Timed
    public ResponseEntity<Volunteer> getVolunteer(@PathVariable Long id) {
        log.debug("REST request to get Volunteer : {}", id);
        Volunteer volunteer = volunteerRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(volunteer));
    }

    /**
     * DELETE  /volunteers/:id : delete the "id" volunteer.
     *
     * @param id the id of the volunteer to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/volunteers/{id}")
    @Timed
    public ResponseEntity<Void> deleteVolunteer(@PathVariable Long id) {
        log.debug("REST request to delete Volunteer : {}", id);
        volunteerRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
