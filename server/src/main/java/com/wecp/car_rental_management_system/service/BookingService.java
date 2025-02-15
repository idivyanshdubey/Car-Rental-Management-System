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
import java.util.concurrent.TimeUnit;

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

    public Booking bookCar(Long userId, Long carId, BookingDto bookingDto) {
        Booking booking = new Booking();
    
        booking.setRentalStartDate(bookingDto.getRentalStartDate());
        booking.setRentalEndDate(bookingDto.getRentalEndDate());
        booking.setStatus("Pending");
    
        // Fetch the user and car details
        User user = userService.getUserById(userId);
        Car car = carService.getCarById(carId);
    
        // Calculate the rental duration in days, rounding up if more than an hour over full days
        long rentalDays = getRoundedDays(bookingDto.getRentalStartDate(), bookingDto.getRentalEndDate());
    
        // Ensure rental days is at least 1
        rentalDays = Math.max(rentalDays, 1);
    
        // Calculate the total amount
        double totalAmount = rentalDays * car.getRentalRatePerDay();
        booking.setTotalAmount(totalAmount);

        car.setStatus("pending");
    
        // Set the user and car details in the booking
        booking.setUser(user);
        booking.setCar(car);

        booking.setPaymentStatus("Pending");
        
        return bookingRepository.save(booking);
    }
    
    // Helper method to calculate the difference in days, rounding up if extra hours exist
    private long getRoundedDays(Date startDate, Date endDate) {
        long diffInMillies = endDate.getTime() - startDate.getTime();
        
        long fullDays = TimeUnit.DAYS.convert(diffInMillies, TimeUnit.MILLISECONDS);
        long remainingHours = TimeUnit.HOURS.convert(diffInMillies % TimeUnit.DAYS.toMillis(1), TimeUnit.MILLISECONDS);
    
        // If there's at least 1 extra hour, round up
        return (remainingHours > 0) ? fullDays + 1 : fullDays;
    }

    public List<Booking> getAllBookings(){
        return bookingRepository.findAll();
    }

    public Booking updateBookingStatus(Long bookingId, String status){
        Booking booking  =  bookingRepository.findById(bookingId).get();
        booking.setStatus(status);

        Long carId = booking.getCar().getId();

        Car car = carService.getCarById(carId);

        car.setStatus(status);

        booking.setCar(car);

        return bookingRepository.save(booking);
    }

    public List<Booking> getBookingsByUserId(Long userId){
        return bookingRepository.getBookingsByUserId(userId);
    }


}
