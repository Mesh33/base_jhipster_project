package com.mescourses.web.rest;

import com.mescourses.Microservice1App;

import com.mescourses.domain.Race;
import com.mescourses.repository.RaceRepository;
import com.mescourses.repository.search.RaceSearchRepository;
import com.mescourses.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the RaceResource REST controller.
 *
 * @see RaceResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = Microservice1App.class)
public class RaceResourceIntTest {

    private static final LocalDate DEFAULT_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final String DEFAULT_PLACE = "AAAAAAAAAA";
    private static final String UPDATED_PLACE = "BBBBBBBBBB";

    private static final Integer DEFAULT_PRICE = 1;
    private static final Integer UPDATED_PRICE = 2;

    private static final String DEFAULT_RACE_NAME = "AAAAAAAAAA";
    private static final String UPDATED_RACE_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_DEPARTMENT = "AAAAAAAAAA";
    private static final String UPDATED_DEPARTMENT = "BBBBBBBBBB";

    @Autowired
    private RaceRepository raceRepository;

    @Autowired
    private RaceSearchRepository raceSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restRaceMockMvc;

    private Race race;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final RaceResource raceResource = new RaceResource(raceRepository, raceSearchRepository);
        this.restRaceMockMvc = MockMvcBuilders.standaloneSetup(raceResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setMessageConverters(jacksonMessageConverter).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Race createEntity(EntityManager em) {
        Race race = new Race()
            .date(DEFAULT_DATE)
            .place(DEFAULT_PLACE)
            .price(DEFAULT_PRICE)
            .raceName(DEFAULT_RACE_NAME)
            .department(DEFAULT_DEPARTMENT);
        return race;
    }

    @Before
    public void initTest() {
        raceSearchRepository.deleteAll();
        race = createEntity(em);
    }

    @Test
    @Transactional
    public void createRace() throws Exception {
        int databaseSizeBeforeCreate = raceRepository.findAll().size();

        // Create the Race
        restRaceMockMvc.perform(post("/api/races")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(race)))
            .andExpect(status().isCreated());

        // Validate the Race in the database
        List<Race> raceList = raceRepository.findAll();
        assertThat(raceList).hasSize(databaseSizeBeforeCreate + 1);
        Race testRace = raceList.get(raceList.size() - 1);
        assertThat(testRace.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testRace.getPlace()).isEqualTo(DEFAULT_PLACE);
        assertThat(testRace.getPrice()).isEqualTo(DEFAULT_PRICE);
        assertThat(testRace.getRaceName()).isEqualTo(DEFAULT_RACE_NAME);
        assertThat(testRace.getDepartment()).isEqualTo(DEFAULT_DEPARTMENT);

        // Validate the Race in Elasticsearch
        Race raceEs = raceSearchRepository.findOne(testRace.getId());
        assertThat(raceEs).isEqualToComparingFieldByField(testRace);
    }

    @Test
    @Transactional
    public void createRaceWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = raceRepository.findAll().size();

        // Create the Race with an existing ID
        race.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restRaceMockMvc.perform(post("/api/races")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(race)))
            .andExpect(status().isBadRequest());

        // Validate the Race in the database
        List<Race> raceList = raceRepository.findAll();
        assertThat(raceList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkDateIsRequired() throws Exception {
        int databaseSizeBeforeTest = raceRepository.findAll().size();
        // set the field null
        race.setDate(null);

        // Create the Race, which fails.

        restRaceMockMvc.perform(post("/api/races")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(race)))
            .andExpect(status().isBadRequest());

        List<Race> raceList = raceRepository.findAll();
        assertThat(raceList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkPriceIsRequired() throws Exception {
        int databaseSizeBeforeTest = raceRepository.findAll().size();
        // set the field null
        race.setPrice(null);

        // Create the Race, which fails.

        restRaceMockMvc.perform(post("/api/races")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(race)))
            .andExpect(status().isBadRequest());

        List<Race> raceList = raceRepository.findAll();
        assertThat(raceList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllRaces() throws Exception {
        // Initialize the database
        raceRepository.saveAndFlush(race);

        // Get all the raceList
        restRaceMockMvc.perform(get("/api/races?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(race.getId().intValue())))
            .andExpect(jsonPath("$.[*].date").value(hasItem(DEFAULT_DATE.toString())))
            .andExpect(jsonPath("$.[*].place").value(hasItem(DEFAULT_PLACE.toString())))
            .andExpect(jsonPath("$.[*].price").value(hasItem(DEFAULT_PRICE)))
            .andExpect(jsonPath("$.[*].raceName").value(hasItem(DEFAULT_RACE_NAME.toString())))
            .andExpect(jsonPath("$.[*].department").value(hasItem(DEFAULT_DEPARTMENT.toString())));
    }

    @Test
    @Transactional
    public void getRace() throws Exception {
        // Initialize the database
        raceRepository.saveAndFlush(race);

        // Get the race
        restRaceMockMvc.perform(get("/api/races/{id}", race.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(race.getId().intValue()))
            .andExpect(jsonPath("$.date").value(DEFAULT_DATE.toString()))
            .andExpect(jsonPath("$.place").value(DEFAULT_PLACE.toString()))
            .andExpect(jsonPath("$.price").value(DEFAULT_PRICE))
            .andExpect(jsonPath("$.raceName").value(DEFAULT_RACE_NAME.toString()))
            .andExpect(jsonPath("$.department").value(DEFAULT_DEPARTMENT.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingRace() throws Exception {
        // Get the race
        restRaceMockMvc.perform(get("/api/races/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateRace() throws Exception {
        // Initialize the database
        raceRepository.saveAndFlush(race);
        raceSearchRepository.save(race);
        int databaseSizeBeforeUpdate = raceRepository.findAll().size();

        // Update the race
        Race updatedRace = raceRepository.findOne(race.getId());
        updatedRace
            .date(UPDATED_DATE)
            .place(UPDATED_PLACE)
            .price(UPDATED_PRICE)
            .raceName(UPDATED_RACE_NAME)
            .department(UPDATED_DEPARTMENT);

        restRaceMockMvc.perform(put("/api/races")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedRace)))
            .andExpect(status().isOk());

        // Validate the Race in the database
        List<Race> raceList = raceRepository.findAll();
        assertThat(raceList).hasSize(databaseSizeBeforeUpdate);
        Race testRace = raceList.get(raceList.size() - 1);
        assertThat(testRace.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testRace.getPlace()).isEqualTo(UPDATED_PLACE);
        assertThat(testRace.getPrice()).isEqualTo(UPDATED_PRICE);
        assertThat(testRace.getRaceName()).isEqualTo(UPDATED_RACE_NAME);
        assertThat(testRace.getDepartment()).isEqualTo(UPDATED_DEPARTMENT);

        // Validate the Race in Elasticsearch
        Race raceEs = raceSearchRepository.findOne(testRace.getId());
        assertThat(raceEs).isEqualToComparingFieldByField(testRace);
    }

    @Test
    @Transactional
    public void updateNonExistingRace() throws Exception {
        int databaseSizeBeforeUpdate = raceRepository.findAll().size();

        // Create the Race

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restRaceMockMvc.perform(put("/api/races")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(race)))
            .andExpect(status().isCreated());

        // Validate the Race in the database
        List<Race> raceList = raceRepository.findAll();
        assertThat(raceList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteRace() throws Exception {
        // Initialize the database
        raceRepository.saveAndFlush(race);
        raceSearchRepository.save(race);
        int databaseSizeBeforeDelete = raceRepository.findAll().size();

        // Get the race
        restRaceMockMvc.perform(delete("/api/races/{id}", race.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean raceExistsInEs = raceSearchRepository.exists(race.getId());
        assertThat(raceExistsInEs).isFalse();

        // Validate the database is empty
        List<Race> raceList = raceRepository.findAll();
        assertThat(raceList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchRace() throws Exception {
        // Initialize the database
        raceRepository.saveAndFlush(race);
        raceSearchRepository.save(race);

        // Search the race
        restRaceMockMvc.perform(get("/api/_search/races?query=id:" + race.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(race.getId().intValue())))
            .andExpect(jsonPath("$.[*].date").value(hasItem(DEFAULT_DATE.toString())))
            .andExpect(jsonPath("$.[*].place").value(hasItem(DEFAULT_PLACE.toString())))
            .andExpect(jsonPath("$.[*].price").value(hasItem(DEFAULT_PRICE)))
            .andExpect(jsonPath("$.[*].raceName").value(hasItem(DEFAULT_RACE_NAME.toString())))
            .andExpect(jsonPath("$.[*].department").value(hasItem(DEFAULT_DEPARTMENT.toString())));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Race.class);
        Race race1 = new Race();
        race1.setId(1L);
        Race race2 = new Race();
        race2.setId(race1.getId());
        assertThat(race1).isEqualTo(race2);
        race2.setId(2L);
        assertThat(race1).isNotEqualTo(race2);
        race1.setId(null);
        assertThat(race1).isNotEqualTo(race2);
    }
}
