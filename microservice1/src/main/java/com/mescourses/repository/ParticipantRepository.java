package com.mescourses.repository;

import com.mescourses.domain.Participant;
import org.springframework.stereotype.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the Participant entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ParticipantRepository extends JpaRepository<Participant, Long> {
	
	List<Participant> findByUsername(String userName);

}
