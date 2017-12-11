package com.mescourses.repository;

import com.mescourses.domain.Itinerary;
import org.springframework.stereotype.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the Itinerary entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ItineraryRepository extends JpaRepository<Itinerary, Long> {

	List<Itinerary> findByRaceid(Integer raceid);

//	Itinerary findByRaceid(long raceId);
}
