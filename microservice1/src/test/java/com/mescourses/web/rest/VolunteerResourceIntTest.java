package com.mescourses.web.rest;

import com.mescourses.Microservice1App;

import com.mescourses.domain.Volunteer;
import com.mescourses.repository.VolunteerRepository;
import com.mescourses.repository.search.VolunteerSearchRepository;
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
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mescourses.domain.enumeration.Specialite;
/**
 * Test class for the VolunteerResource REST controller.
 *
 * @see VolunteerResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = Microservice1App.class)
public class VolunteerResourceIntTest {

    private static final String DEFAULT_PARTICIPANT = "AAAAAAAAAA";
    private static final String UPDATED_PARTICIPANT = "BBBBBBBBBB";

    private static final Specialite DEFAULT_SPECIALITE = Specialite.MEDECIN;
    private static final Specialite UPDATED_SPECIALITE = Specialite.OUVREUR;

    @Autowired
    private VolunteerRepository volunteerRepository;

    @Autowired
    private VolunteerSearchRepository volunteerSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restVolunteerMockMvc;

    private Volunteer volunteer;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final VolunteerResource volunteerResource = new VolunteerResource(volunteerRepository, volunteerSearchRepository);
        this.restVolunteerMockMvc = MockMvcBuilders.standaloneSetup(volunteerResource)
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
    public static Volunteer createEntity(EntityManager em) {
        Volunteer volunteer = new Volunteer()
            .participant(DEFAULT_PARTICIPANT)
            .specialite(DEFAULT_SPECIALITE);
        return volunteer;
    }

    @Before
    public void initTest() {
        volunteerSearchRepository.deleteAll();
        volunteer = createEntity(em);
    }

    @Test
    @Transactional
    public void createVolunteer() throws Exception {
        int databaseSizeBeforeCreate = volunteerRepository.findAll().size();

        // Create the Volunteer
        restVolunteerMockMvc.perform(post("/api/volunteers")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(volunteer)))
            .andExpect(status().isCreated());

        // Validate the Volunteer in the database
        List<Volunteer> volunteerList = volunteerRepository.findAll();
        assertThat(volunteerList).hasSize(databaseSizeBeforeCreate + 1);
        Volunteer testVolunteer = volunteerList.get(volunteerList.size() - 1);
        assertThat(testVolunteer.getParticipant()).isEqualTo(DEFAULT_PARTICIPANT);
        assertThat(testVolunteer.getSpecialite()).isEqualTo(DEFAULT_SPECIALITE);

        // Validate the Volunteer in Elasticsearch
        Volunteer volunteerEs = volunteerSearchRepository.findOne(testVolunteer.getId());
        assertThat(volunteerEs).isEqualToComparingFieldByField(testVolunteer);
    }

    @Test
    @Transactional
    public void createVolunteerWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = volunteerRepository.findAll().size();

        // Create the Volunteer with an existing ID
        volunteer.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restVolunteerMockMvc.perform(post("/api/volunteers")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(volunteer)))
            .andExpect(status().isBadRequest());

        // Validate the Volunteer in the database
        List<Volunteer> volunteerList = volunteerRepository.findAll();
        assertThat(volunteerList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkParticipantIsRequired() throws Exception {
        int databaseSizeBeforeTest = volunteerRepository.findAll().size();
        // set the field null
        volunteer.setParticipant(null);

        // Create the Volunteer, which fails.

        restVolunteerMockMvc.perform(post("/api/volunteers")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(volunteer)))
            .andExpect(status().isBadRequest());

        List<Volunteer> volunteerList = volunteerRepository.findAll();
        assertThat(volunteerList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllVolunteers() throws Exception {
        // Initialize the database
        volunteerRepository.saveAndFlush(volunteer);

        // Get all the volunteerList
        restVolunteerMockMvc.perform(get("/api/volunteers?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(volunteer.getId().intValue())))
            .andExpect(jsonPath("$.[*].participant").value(hasItem(DEFAULT_PARTICIPANT.toString())))
            .andExpect(jsonPath("$.[*].specialite").value(hasItem(DEFAULT_SPECIALITE.toString())));
    }

    @Test
    @Transactional
    public void getVolunteer() throws Exception {
        // Initialize the database
        volunteerRepository.saveAndFlush(volunteer);

        // Get the volunteer
        restVolunteerMockMvc.perform(get("/api/volunteers/{id}", volunteer.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(volunteer.getId().intValue()))
            .andExpect(jsonPath("$.participant").value(DEFAULT_PARTICIPANT.toString()))
            .andExpect(jsonPath("$.specialite").value(DEFAULT_SPECIALITE.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingVolunteer() throws Exception {
        // Get the volunteer
        restVolunteerMockMvc.perform(get("/api/volunteers/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateVolunteer() throws Exception {
        // Initialize the database
        volunteerRepository.saveAndFlush(volunteer);
        volunteerSearchRepository.save(volunteer);
        int databaseSizeBeforeUpdate = volunteerRepository.findAll().size();

        // Update the volunteer
        Volunteer updatedVolunteer = volunteerRepository.findOne(volunteer.getId());
        updatedVolunteer
            .participant(UPDATED_PARTICIPANT)
            .specialite(UPDATED_SPECIALITE);

        restVolunteerMockMvc.perform(put("/api/volunteers")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedVolunteer)))
            .andExpect(status().isOk());

        // Validate the Volunteer in the database
        List<Volunteer> volunteerList = volunteerRepository.findAll();
        assertThat(volunteerList).hasSize(databaseSizeBeforeUpdate);
        Volunteer testVolunteer = volunteerList.get(volunteerList.size() - 1);
        assertThat(testVolunteer.getParticipant()).isEqualTo(UPDATED_PARTICIPANT);
        assertThat(testVolunteer.getSpecialite()).isEqualTo(UPDATED_SPECIALITE);

        // Validate the Volunteer in Elasticsearch
        Volunteer volunteerEs = volunteerSearchRepository.findOne(testVolunteer.getId());
        assertThat(volunteerEs).isEqualToComparingFieldByField(testVolunteer);
    }

    @Test
    @Transactional
    public void updateNonExistingVolunteer() throws Exception {
        int databaseSizeBeforeUpdate = volunteerRepository.findAll().size();

        // Create the Volunteer

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restVolunteerMockMvc.perform(put("/api/volunteers")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(volunteer)))
            .andExpect(status().isCreated());

        // Validate the Volunteer in the database
        List<Volunteer> volunteerList = volunteerRepository.findAll();
        assertThat(volunteerList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteVolunteer() throws Exception {
        // Initialize the database
        volunteerRepository.saveAndFlush(volunteer);
        volunteerSearchRepository.save(volunteer);
        int databaseSizeBeforeDelete = volunteerRepository.findAll().size();

        // Get the volunteer
        restVolunteerMockMvc.perform(delete("/api/volunteers/{id}", volunteer.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean volunteerExistsInEs = volunteerSearchRepository.exists(volunteer.getId());
        assertThat(volunteerExistsInEs).isFalse();

        // Validate the database is empty
        List<Volunteer> volunteerList = volunteerRepository.findAll();
        assertThat(volunteerList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchVolunteer() throws Exception {
        // Initialize the database
        volunteerRepository.saveAndFlush(volunteer);
        volunteerSearchRepository.save(volunteer);

        // Search the volunteer
        restVolunteerMockMvc.perform(get("/api/_search/volunteers?query=id:" + volunteer.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(volunteer.getId().intValue())))
            .andExpect(jsonPath("$.[*].participant").value(hasItem(DEFAULT_PARTICIPANT.toString())))
            .andExpect(jsonPath("$.[*].specialite").value(hasItem(DEFAULT_SPECIALITE.toString())));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Volunteer.class);
        Volunteer volunteer1 = new Volunteer();
        volunteer1.setId(1L);
        Volunteer volunteer2 = new Volunteer();
        volunteer2.setId(volunteer1.getId());
        assertThat(volunteer1).isEqualTo(volunteer2);
        volunteer2.setId(2L);
        assertThat(volunteer1).isNotEqualTo(volunteer2);
        volunteer1.setId(null);
        assertThat(volunteer1).isNotEqualTo(volunteer2);
    }
}
