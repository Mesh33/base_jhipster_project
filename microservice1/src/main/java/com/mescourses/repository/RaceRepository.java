package com.mescourses.repository;

import com.mescourses.domain.Race;
import com.mescourses.domain.enumeration.RaceType;

import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;


/**
 * Spring Data JPA repository for the Race entity.
 */
@Repository
public interface RaceRepository extends JpaRepository<Race, Long> {
	
	@Query("SELECT r FROM Race r "
			+ "WHERE r.raceType = :type "
			+ "AND r.date = :date "
			+ "AND r.place LIKE %:place% "
			+ "AND r.department LIKE %:dept%")
	List<Race> findRaceCustomAll(
			@Param("type") RaceType type,
			@Param("dept") String dept,
			@Param("date") LocalDate date,
			@Param("place") String place
			);
	
	@Query("SELECT r FROM Race r "
			+ "WHERE r.date = :date "
			+ "AND r.place LIKE %:place% "
			+ "AND r.department LIKE %:dept%")
	List<Race> findRaceCustomNoType(
			@Param("dept") String dept,
			@Param("date") LocalDate date,
			@Param("place") String place
			);
	
	@Query("SELECT r FROM Race r "
			+ "WHERE r.raceType = :type "
			+ "AND r.place LIKE %:place% "
			+ "AND r.department LIKE %:dept%")
	List<Race> findRaceCustomNoDate(
			@Param("type") RaceType type,
			@Param("dept") String dept,
			@Param("place") String place
			);
	
	@Query("SELECT r FROM Race r "
			+ "WHERE r.place LIKE %:place% "
			+ "AND r.department LIKE %:dept%")
	List<Race> findRaceCustomSimple(
			@Param("dept") String dept,
			@Param("place") String place
			);
}
