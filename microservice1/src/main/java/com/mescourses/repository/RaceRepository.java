package com.mescourses.repository;

import com.mescourses.domain.Race;
import com.mescourses.domain.enumeration.RaceType;

import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

import javax.annotation.Nullable;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;


/**
 * Spring Data JPA repository for the Race entity.
 */
@Repository
public interface RaceRepository extends JpaRepository<Race, Long> {

	@Query("SELECT r FROM Race r WHERE r.raceType = :type% AND r.date = :date AND r.place =:place%")
	List<Race> findRaceCustom(
								@Param("type") RaceType type,
								@Param("date") LocalDate date,
								@Param("place") String place
								);

	
	
	//Exist avec subquery?
	
//	@Query("FROM Race ")
//	List<Race> customFindRace(	@Param("") String lastname,
//								@Param("") String firstname);

	//	@Query("SELECT r FROM Race r WHERE r.place LIKE :place%")

	
	
// @Query("SELECT organizer FROM Race")	
//  @QueryHints(value = { @QueryHint(name = "name", value = "value")}, forCounting = false)	
	
	
//	Race findOne(String city);

//	Race findAllByPlace(String city);	
}
