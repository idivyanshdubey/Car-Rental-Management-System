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

@RestController
public class AgentController {

    @Autowired
    private CarService carService;

    @Autowired
    private PaymentService paymentService;
    
    @Autowired
    private BookingService bookingService;


    @PostMapping("/api/agent/car")
    public ResponseEntity<?> addCar(@RequestBody Car car) {
        
            if(carService.addCar(car) == null){
                return new ResponseEntity<>(HttpStatus.CONFLICT);
            }

            Car createdCar = carService.addCar(car);
            return new ResponseEntity<>(createdCar, HttpStatus.CREATED);

    }

    @GetMapping("/api/agent/cars")
    public ResponseEntity<List<Car>> getAllCars() {
        // get all cars
        return new ResponseEntity<List<Car>>(carService.getAllCars(), HttpStatus.OK);
    }

    @PutMapping("/api/agent/car/{carId}")
    public ResponseEntity<Car> updateCar(@PathVariable Long carId, @RequestBody Car updatedCar) {
        // update a car
        return new ResponseEntity<Car>(carService.updateCar(carId, updatedCar), HttpStatus.OK);
    }

    @GetMapping("/api/agent/bookings")
    public ResponseEntity<List<Booking>> getAllBookings() {
        // get all bookings
        return new ResponseEntity<>(bookingService.getAllBookings(),HttpStatus.OK);
    }

    @PutMapping("/api/agent/bookings/{bookingId}/status")
    public ResponseEntity<Booking> updateBookingStatus(@PathVariable Long bookingId, @RequestParam String status) {
       // update booking status
       return new ResponseEntity<>(bookingService.updateBookingStatus(bookingId, status), HttpStatus.OK);
    }

    @PostMapping("/api/agent/payment/{bookingId}")
    public ResponseEntity<Payment> createPayment(@PathVariable Long bookingId,
                                                   @RequestBody Payment paymentRequest) {
        return new ResponseEntity<>(paymentService.createPayment(bookingId, paymentRequest),HttpStatus.OK);
    }
}

