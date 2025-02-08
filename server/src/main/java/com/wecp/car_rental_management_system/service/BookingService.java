package com.wecp.car_rental_management_system.service;

import com.wecp.car_rental_management_system.entity.Booking;
import com.wecp.car_rental_management_system.entity.Car;
import com.wecp.car_rental_management_system.entity.User;
import com.wecp.car_rental_management_system.repository.BookingRepository;
import com.wecp.car_rental_management_system.repository.CarRepository;
import com.wecp.car_rental_management_system.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class BookingService {
    // implement booking service
    private BookingRepository bookingRepository;

    @Autowired
    public BookingService(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    public List<Booking> getAllBooking(){
        return bookingRepository.findAll();
    }

    public Booking updateBookingStatus(Long bookingId, String status){
        bookingRepository.updateBookingStatus(bookingId, status);
        return bookingRepository.findById(bookingId).get();
    }


}
