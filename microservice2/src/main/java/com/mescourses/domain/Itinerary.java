package com.mescourses.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Objects;


/**
 * A Itinerary.
 */
@Entity
@Table(name = "itinerary")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class Itinerary implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "geojson")
    private String geojson;

    @Column(name = "raceid")
    private Integer raceid;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getGeojson() {
        return geojson;
    }

    public Itinerary geojson(String geojson) {
        this.geojson = geojson;
        return this;
    }

    public void setGeojson(String geojson) {
        this.geojson = geojson;
    }

    public Integer getRaceid() {
        return raceid;
    }

    public Itinerary raceid(Integer raceid) {
        this.raceid = raceid;
        return this;
    }

    public void setRaceid(Integer raceid) {
        this.raceid = raceid;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Itinerary itinerary = (Itinerary) o;
        if (itinerary.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), itinerary.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Itinerary{" +
            "id=" + getId() +
            ", geojson='" + getGeojson() + "'" +
            ", raceid=" + getRaceid() +
            "}";
    }
}
