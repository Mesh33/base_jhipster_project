package com.mescourses.repository.search;

import com.mescourses.domain.Race;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Race entity.
 */
public interface RaceSearchRepository extends ElasticsearchRepository<Race, Long> {
}
