package com.mescourses.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

import com.mescourses.domain.enumeration.RaceType;

/**
 * A Race.
 */
@Entity
@Table(name = "race")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class Race implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "jhi_date", nullable = false)
    private LocalDate date;

    @Column(name = "place")
    private String place;

    @NotNull
    @Column(name = "price", nullable = false)
    private Integer price;

    @Column(name = "department")
    private String department;

    @Column(name = "race_name")
    private String raceName;

    @Enumerated(EnumType.STRING)
    @Column(name = "race_type")
    private RaceType raceType;

    @NotNull
    @Column(name = "organisateur", nullable = false)
    private String organisateur;

    @OneToMany(mappedBy = "race")
    @JsonIgnore
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<Participant> participants = new HashSet<>();

    // jhipster-needle-entity-add-field - Jhipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getDate() {
        return date;
    }

    public Race date(LocalDate date) {
        this.date = date;
        return this;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public String getPlace() {
        return place;
    }

    public Race place(String place) {
        this.place = place;
        return this;
    }

    public void setPlace(String place) {
        this.place = place;
    }

    public Integer getPrice() {
        return price;
    }

    public Race price(Integer price) {
        this.price = price;
        return this;
    }

    public void setPrice(Integer price) {
        this.price = price;
    }

    public String getDepartment() {
        return department;
    }

    public Race department(String department) {
        this.department = department;
        return this;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getRaceName() {
        return raceName;
    }

    public Race raceName(String raceName) {
        this.raceName = raceName;
        return this;
    }

    public void setRaceName(String raceName) {
        this.raceName = raceName;
    }

    public RaceType getRaceType() {
        return raceType;
    }

    public Race raceType(RaceType raceType) {
        this.raceType = raceType;
        return this;
    }

    public void setRaceType(RaceType raceType) {
        this.raceType = raceType;
    }

    public String getOrganisateur() {
        return organisateur;
    }

    public Race organisateur(String organisateur) {
        this.organisateur = organisateur;
        return this;
    }

    public void setOrganisateur(String organisateur) {
        this.organisateur = organisateur;
    }

    public Set<Participant> getParticipants() {
        return participants;
    }

    public Race participants(Set<Participant> participants) {
        this.participants = participants;
        return this;
    }

    public Race addParticipants(Participant participant) {
        this.participants.add(participant);
        participant.setRace(this);
        return this;
    }

    public Race removeParticipants(Participant participant) {
        this.participants.remove(participant);
        participant.setRace(null);
        return this;
    }

    public void setParticipants(Set<Participant> participants) {
        this.participants = participants;
    }

    // jhipster-needle-entity-add-getters-setters - Jhipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Race race = (Race) o;
        if (race.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), race.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Race{" +
            "id=" + getId() +
            ", date='" + getDate() + "'" +
            ", place='" + getPlace() + "'" +
            ", price='" + getPrice() + "'" +
            ", department='" + getDepartment() + "'" +
            ", raceName='" + getRaceName() + "'" +
            ", raceType='" + getRaceType() + "'" +
            ", organisateur='" + getOrganisateur() + "'" +
            "}";
    }
}
