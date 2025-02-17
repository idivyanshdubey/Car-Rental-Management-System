package com.wecp.car_rental_management_system.repository;


import com.wecp.car_rental_management_system.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long>{
    // implement jpa repository here

    User findByUsername(String username);
    boolean existsByEmail(String email);
    boolean existsByUsername(String username);
<<<<<<< HEAD
    
=======
>>>>>>> 8e48894b0fc5f613f2949812708cecbba878922e
}
