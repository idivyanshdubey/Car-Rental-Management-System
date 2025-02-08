package com.wecp.car_rental_management_system.repository;


import com.wecp.car_rental_management_system.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


@Repository
public interface PaymentRepository extends JpaRepository<Payment,Long> {

    @Query("SELECT p FROM Payment p WHERE p.bookingId = :bookingId")
Payment findPaymentByBookingId(@Param("bookingId") Long bookingId);


}

