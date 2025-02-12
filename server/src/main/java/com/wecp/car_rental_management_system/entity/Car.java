package com.wecp.car_rental_management_system.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "cars") // do not change this line i.e table name
public class Car {
    // implement entity
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    String make;
    String model;
    String manufactureYear;
    String registrationNumber;
    String status; // available, booked etc
    Double rentalRatePerDay;

    @ManyToOne
    CarCategory category;

    @OneToMany(mappedBy = "car", cascade = CascadeType.ALL)
    @JsonIgnore
    List<Booking> bookings;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMake() {
        return make;
    }

    public void setMake(String make) {
        this.make = make;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public String getManufactureYear() {
        return manufactureYear;
    }

    public void setManufactureYear(String manufactureYear) {
        this.manufactureYear = manufactureYear;
    }

    public String getRegistrationNumber() {
        return registrationNumber;
    }

    public void setRegistrationNumber(String registrationNumber) {
        this.registrationNumber = registrationNumber;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Double getRentalRatePerDay() {
        return rentalRatePerDay;
    }

    public void setRentalRatePerDay(Double rentalRatePerDay) {
        this.rentalRatePerDay = rentalRatePerDay;
    }

    public CarCategory getCategory() {
        return category;
    }

    public void setCategory(CarCategory category) {
        this.category = category;
    }

    public List<Booking> getBookings() {
        return bookings;
    }

    public void setBookings(List<Booking> bookings) {
        this.bookings = bookings;
    }

    
}
