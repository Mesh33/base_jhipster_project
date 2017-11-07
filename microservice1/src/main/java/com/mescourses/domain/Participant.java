package com.mescourses.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;
import java.io.Serializable;
import java.util.Objects;

/**
 * A Participant.
 */
@Entity
@Table(name = "participant")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class Participant implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "username", nullable = false)
    private String username;

    @Column(name = "prefered_race")
    private String preferedRace;

    @ManyToOne
    private Race race;

    // jhipster-needle-entity-add-field - Jhipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public Participant username(String username) {
        this.username = username;
        return this;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPreferedRace() {
        return preferedRace;
    }

    public Participant preferedRace(String preferedRace) {
        this.preferedRace = preferedRace;
        return this;
    }

    public void setPreferedRace(String preferedRace) {
        this.preferedRace = preferedRace;
    }

    public Race getRace() {
        return race;
    }

    public Participant race(Race race) {
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
        Participant participant = (Participant) o;
        if (participant.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), participant.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Participant{" +
            "id=" + getId() +
            ", username='" + getUsername() + "'" +
            ", preferedRace='" + getPreferedRace() + "'" +
            "}";
    }
}
