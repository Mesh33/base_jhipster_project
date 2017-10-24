package com.mescourses.domain;

import org.springframework.data.elasticsearch.annotations.Document;

import javax.persistence.*;
import javax.validation.constraints.*;
import java.io.Serializable;
import java.util.Objects;

import com.mescourses.domain.enumeration.Specialite;

/**
 * A Volunteer.
 */
@Entity
@Table(name = "volunteer")
@Document(indexName = "volunteer")
public class Volunteer implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "participant", nullable = false)
    private String participant;

    @Enumerated(EnumType.STRING)
    @Column(name = "specialite")
    private Specialite specialite;

    @ManyToOne
    private Race race;

    // jhipster-needle-entity-add-field - Jhipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getParticipant() {
        return participant;
    }

    public Volunteer participant(String participant) {
        this.participant = participant;
        return this;
    }

    public void setParticipant(String participant) {
        this.participant = participant;
    }

    public Specialite getSpecialite() {
        return specialite;
    }

    public Volunteer specialite(Specialite specialite) {
        this.specialite = specialite;
        return this;
    }

    public void setSpecialite(Specialite specialite) {
        this.specialite = specialite;
    }

    public Race getRace() {
        return race;
    }

    public Volunteer race(Race race) {
        this.race = race;
        return this;
    }

    public void setRace(Race race) {
        this.race = race;
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
        Volunteer volunteer = (Volunteer) o;
        if (volunteer.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), volunteer.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Volunteer{" +
            "id=" + getId() +
            ", participant='" + getParticipant() + "'" +
            ", specialite='" + getSpecialite() + "'" +
            "}";
    }
}
