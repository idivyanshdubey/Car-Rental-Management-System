package com.wecp.car_rental_management_system.service;

import com.wecp.car_rental_management_system.entity.User;
import com.wecp.car_rental_management_system.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserService implements UserDetailsService{

    @Autowired
    private UserRepository userRepository;

    public User registerUser(User user)
    {
        return userRepository.save(user);
    }

     public User getUserByUsername(String username) {
            return userRepository.findByUsername(username);
        }
    
        @Override
        public UserDetails loadUserByUsername(String username) {
            User user = userRepository.findByUsername(username);
            if(user == null){
                throw new UsernameNotFoundException("User not found");
            }
            return new org.springframework.security.core.userdetails.User(user.getUsername(), user.getPassword(), new ArrayList<>());
        }
    
}
