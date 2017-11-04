package com.mescourses.repository.search;

import com.mescourses.domain.Volunteer;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Volunteer entity.
 */
public interface VolunteerSearchRepository extends ElasticsearchRepository<Volunteer, Long> {
}
