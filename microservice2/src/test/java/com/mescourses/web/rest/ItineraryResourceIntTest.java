package com.mescourses.web.rest;

import com.mescourses.Microservice2App;

import com.mescourses.domain.Itinerary;
import com.mescourses.repository.ItineraryRepository;
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

import static com.mescourses.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the ItineraryResource REST controller.
 *
 * @see ItineraryResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = Microservice2App.class)
public class ItineraryResourceIntTest {

    private static final String DEFAULT_GEOJSON = "AAAAAAAAAA";
    private static final String UPDATED_GEOJSON = "BBBBBBBBBB";

    private static final Integer DEFAULT_RACEID = 1;
    private static final Integer UPDATED_RACEID = 2;

    @Autowired
    private ItineraryRepository itineraryRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restItineraryMockMvc;

    private Itinerary itinerary;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final ItineraryResource itineraryResource = new ItineraryResource(itineraryRepository);
        this.restItineraryMockMvc = MockMvcBuilders.standaloneSetup(itineraryResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Itinerary createEntity(EntityManager em) {
        Itinerary itinerary = new Itinerary()
            .geojson(DEFAULT_GEOJSON)
            .raceid(DEFAULT_RACEID);
        return itinerary;
    }

    @Before
    public void initTest() {
        itinerary = createEntity(em);
    }

    @Test
    @Transactional
    public void createItinerary() throws Exception {
        int databaseSizeBeforeCreate = itineraryRepository.findAll().size();

        // Create the Itinerary
        restItineraryMockMvc.perform(post("/api/itineraries")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(itinerary)))
            .andExpect(status().isCreated());

        // Validate the Itinerary in the database
        List<Itinerary> itineraryList = itineraryRepository.findAll();
        assertThat(itineraryList).hasSize(databaseSizeBeforeCreate + 1);
        Itinerary testItinerary = itineraryList.get(itineraryList.size() - 1);
        assertThat(testItinerary.getGeojson()).isEqualTo(DEFAULT_GEOJSON);
        assertThat(testItinerary.getRaceid()).isEqualTo(DEFAULT_RACEID);
    }

    @Test
    @Transactional
    public void createItineraryWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = itineraryRepository.findAll().size();

        // Create the Itinerary with an existing ID
        itinerary.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restItineraryMockMvc.perform(post("/api/itineraries")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(itinerary)))
            .andExpect(status().isBadRequest());

        // Validate the Itinerary in the database
        List<Itinerary> itineraryList = itineraryRepository.findAll();
        assertThat(itineraryList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllItineraries() throws Exception {
        // Initialize the database
        itineraryRepository.saveAndFlush(itinerary);

        // Get all the itineraryList
        restItineraryMockMvc.perform(get("/api/itineraries?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(itinerary.getId().intValue())))
            .andExpect(jsonPath("$.[*].geojson").value(hasItem(DEFAULT_GEOJSON.toString())))
            .andExpect(jsonPath("$.[*].raceid").value(hasItem(DEFAULT_RACEID)));
    }

    @Test
    @Transactional
    public void getItinerary() throws Exception {
        // Initialize the database
        itineraryRepository.saveAndFlush(itinerary);

        // Get the itinerary
        restItineraryMockMvc.perform(get("/api/itineraries/{id}", itinerary.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(itinerary.getId().intValue()))
            .andExpect(jsonPath("$.geojson").value(DEFAULT_GEOJSON.toString()))
            .andExpect(jsonPath("$.raceid").value(DEFAULT_RACEID));
    }

    @Test
    @Transactional
    public void getNonExistingItinerary() throws Exception {
        // Get the itinerary
        restItineraryMockMvc.perform(get("/api/itineraries/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateItinerary() throws Exception {
        // Initialize the database
        itineraryRepository.saveAndFlush(itinerary);
        int databaseSizeBeforeUpdate = itineraryRepository.findAll().size();

        // Update the itinerary
        Itinerary updatedItinerary = itineraryRepository.findOne(itinerary.getId());
        // Disconnect from session so that the updates on updatedItinerary are not directly saved in db
        em.detach(updatedItinerary);
        updatedItinerary
            .geojson(UPDATED_GEOJSON)
            .raceid(UPDATED_RACEID);

        restItineraryMockMvc.perform(put("/api/itineraries")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedItinerary)))
            .andExpect(status().isOk());

        // Validate the Itinerary in the database
        List<Itinerary> itineraryList = itineraryRepository.findAll();
        assertThat(itineraryList).hasSize(databaseSizeBeforeUpdate);
        Itinerary testItinerary = itineraryList.get(itineraryList.size() - 1);
        assertThat(testItinerary.getGeojson()).isEqualTo(UPDATED_GEOJSON);
        assertThat(testItinerary.getRaceid()).isEqualTo(UPDATED_RACEID);
    }

    @Test
    @Transactional
    public void updateNonExistingItinerary() throws Exception {
        int databaseSizeBeforeUpdate = itineraryRepository.findAll().size();

        // Create the Itinerary

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restItineraryMockMvc.perform(put("/api/itineraries")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(itinerary)))
            .andExpect(status().isCreated());

        // Validate the Itinerary in the database
        List<Itinerary> itineraryList = itineraryRepository.findAll();
        assertThat(itineraryList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteItinerary() throws Exception {
        // Initialize the database
        itineraryRepository.saveAndFlush(itinerary);
        int databaseSizeBeforeDelete = itineraryRepository.findAll().size();

        // Get the itinerary
        restItineraryMockMvc.perform(delete("/api/itineraries/{id}", itinerary.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<Itinerary> itineraryList = itineraryRepository.findAll();
        assertThat(itineraryList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Itinerary.class);
        Itinerary itinerary1 = new Itinerary();
        itinerary1.setId(1L);
        Itinerary itinerary2 = new Itinerary();
        itinerary2.setId(itinerary1.getId());
        assertThat(itinerary1).isEqualTo(itinerary2);
        itinerary2.setId(2L);
        assertThat(itinerary1).isNotEqualTo(itinerary2);
        itinerary1.setId(null);
        assertThat(itinerary1).isNotEqualTo(itinerary2);
    }
}
