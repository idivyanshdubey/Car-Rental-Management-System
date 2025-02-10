package com.wecp.car_rental_management_system.repository;


import com.wecp.car_rental_management_system.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface PaymentRepository extends JpaRepository<Payment,Long> {

    Payment findPaymentByBookingId(Long bookingId);

}

