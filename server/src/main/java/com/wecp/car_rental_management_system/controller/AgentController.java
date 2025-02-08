package com.wecp.car_rental_management_system.controller;


import com.wecp.car_rental_management_system.entity.Booking;
import com.wecp.car_rental_management_system.entity.Car;
import com.wecp.car_rental_management_system.entity.Payment;
import com.wecp.car_rental_management_system.service.BookingService;
import com.wecp.car_rental_management_system.service.CarService;
import com.wecp.car_rental_management_system.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


public class AgentController {

    @Autowired
    private PaymentService paymentService;
    
    @Autowired
    private BookingService bookingService;


    @PostMapping("/api/agent/car")
    public ResponseEntity<Car> addCar(@RequestBody Car car) {
        // add a car and return created car
    }

    @GetMapping("/api/agent/cars")
    public ResponseEntity<List<Car>> getAllCars() {
        // get all cars
    }

    @PutMapping("/api/agent/car/{carId}")
    public ResponseEntity<Car> updateCar(@PathVariable Long carId, @RequestBody Car updatedCar) {
        // update a car
    }

    @GetMapping("/api/agent/bookings")
    public ResponseEntity<List<Booking>> getAllBookings() {
        // get all bookings
        return new ResponseEntity<>(bookingService.getAllBooking(),HttpStatus.OK);
    }

    @PutMapping("/api/agent/bookings/{bookingId}/status")
    public ResponseEntity<Booking> updateBookingStatus(@PathVariable Long bookingId, @RequestParam String status) {
       // update booking status
       return new ResponseEntity<>(bookingService.updateBookingStatus(bookingId, status), HttpStatus.OK);
    }

    @PostMapping("/api/agent/payment/{bookingId}")
    public ResponseEntity<Payment> createPayment(@PathVariable Long bookingId,
                                                   @RequestBody Payment paymentRequest) {
        return new ResponseEntity<Payment>(paymentService.createPayment(bookingId, paymentRequest),HttpStatus.OK);
    }
}

