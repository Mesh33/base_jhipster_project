package com.mescourses.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.mescourses.domain.Race;
import com.mescourses.domain.enumeration.RaceType;
import com.mescourses.repository.RaceRepository;
import com.mescourses.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing Race.
 */
@RestController
@RequestMapping("/api")
public class RaceResource {

    private final Logger log = LoggerFactory.getLogger(RaceResource.class);

    private static final String ENTITY_NAME = "race";

    private final RaceRepository raceRepository;

    public RaceResource(RaceRepository raceRepository) {
        this.raceRepository = raceRepository;
    }

    /**
     * POST  /races : Create a new race.
     *
     * @param race the race to create
     * @return the ResponseEntity with status 201 (Created) and with body the new race, or with status 400 (Bad Request) if the race has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/races")
    @Timed
    public ResponseEntity<Race> createRace(@Valid @RequestBody Race race) throws URISyntaxException {
        log.debug("REST request to save Race : {}", race);
        if (race.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "idexists", "A new race cannot already have an ID")).body(null);
        }
        Race result = raceRepository.save(race);
        return ResponseEntity.created(new URI("/api/races/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /races : Updates an existing race.
     *
     * @param race the race to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated race,
     * or with status 400 (Bad Request) if the race is not valid,
     * or with status 500 (Internal Server Error) if the race couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/races")
    @Timed
    public ResponseEntity<Race> updateRace(@Valid @RequestBody Race race) throws URISyntaxException {
        log.debug("REST request to update Race : {}", race);
        if (race.getId() == null) {
            return createRace(race);
        }
        Race result = raceRepository.save(race);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, race.getId().toString()))
            .body(result);
    }

    /**
     * GET  /races : get all the races.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of races in body
     */
    @GetMapping("/races")
    @Timed
    public List<Race> getAllRaces() {
        log.debug("REST request to get all Races");
        return raceRepository.findAll();
        }
    
    /**
     * GET  /races : get all the races.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of races in body
     */
//    @GetMapping("/races/{customSearch}")
//    @Timed
//    public List<Race> getRaceForm(RaceType type, LocalDate date, String place) {
//        log.debug("REST request to get all Races");
//        
//        return raceRepository.findRaceCustom(type, date, place);
//        }
    
    /**
     * GET  /races/:id : get the "id" race.
     *
     * @param id the id of the race to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the race, or with status 404 (Not Found)
     */
    @GetMapping("/races/{id}")
    @Timed
    public ResponseEntity<Race> getRace(@PathVariable Long id) {
        log.debug("REST request to get Race : {}", id);
        Race race = raceRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(race));
    }

    /**
     * GET  /races/:id : get the "id" race.
     *
     * @param id the id of the race to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the race, or with status 404 (Not Found)
     */
//    @GetMapping("/races/{city}")
//    @Timed
//    public ResponseEntity<Race> getRace(@PathVariable String city) {
//        log.debug("REST request to get Race : {}", id);
//        Race race = raceRepository.findOne(id);
//        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(race));
//    }
    
    
    /**
     * GET /races/_search searches for races answering specific parameters
     * 
     * @return the list of races searched for
     */
    @GetMapping("/races/_search")
    @Timed
    public List<Race> searchForRaces(
    	@RequestParam("type") RaceType type,
    	@RequestParam("dept") String dept,
    	@RequestParam("place") String place,
    	@RequestParam("date") LocalDate date) {
    	return raceRepository.findByRaceTypeAndDepartmentAndDateAndPlace(type, dept, date, place);
    }
    
    
    /**
     * DELETE  /races/:id : delete the "id" race.
     *
     * @param id the id of the race to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/races/{id}")
    @Timed
    public ResponseEntity<Void> deleteRace(@PathVariable Long id) {
        log.debug("REST request to delete Race : {}", id);
        raceRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
