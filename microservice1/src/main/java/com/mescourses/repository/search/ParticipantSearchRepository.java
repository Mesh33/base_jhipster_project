package com.mescourses.repository.search;

import com.mescourses.domain.Participant;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Participant entity.
 */
public interface ParticipantSearchRepository extends ElasticsearchRepository<Participant, Long> {
}
