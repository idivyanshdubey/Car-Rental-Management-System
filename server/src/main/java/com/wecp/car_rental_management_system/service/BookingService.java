package com.wecp.car_rental_management_system.service;

import com.wecp.car_rental_management_system.dto.BookingDto;
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
    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private CarService carService;

    // @Autowired
    // public BookingService(BookingRepository bookingRepository) {
    //     this.bookingRepository = bookingRepository;
    // }

    public Booking bookCar(Long userId, Long carId, BookingDto bookingDto){

        Booking booking = new Booking();

        booking.setRentalStartDate(bookingDto.getRentalStartDate());
        booking.setRentalEndDate(bookingDto.getRentalEndDate());
        
        // Fetch the user and car details
        User user = userService.getUserById(userId);
        Car car = carService.getCarById(carId);

        // Set the user and car details in the booking
        booking.setUser(user);
        booking.setCar(car);

        return bookingRepository.save(booking);
    }

    public List<Booking> getAllBookings(){
        return bookingRepository.findAll();
    }

    public Booking updateBookingStatus(Long bookingId, String status){
        bookingRepository.updateBookingStatus(bookingId, status);
        return bookingRepository.findById(bookingId).get();
    }


}
