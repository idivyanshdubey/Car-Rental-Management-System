package com.wecp.car_rental_management_system.service;

import com.wecp.car_rental_management_system.entity.User;
import com.wecp.car_rental_management_system.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class UserService implements UserDetailsService{

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;
    
        public boolean existsByEmail(String email) {
            return userRepository.existsByEmail(email);
        }
    
        public boolean existsByUsername(String username) {
            return userRepository.existsByUsername(username);
        }

    

    public User registerUser(User user) throws Exception
    {
        User oldUser = userRepository.findByUsername(user.getUsername());
        if(oldUser != null){
            throw new Exception("User name is Unavailable: " + user.getUsername());
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public User getUserById(Long userId){
        return userRepository.findById(userId).orElseThrow(() -> new NoSuchElementException("No Such element found"));
    }

    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }
    
    @Override
        public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
            User user = userRepository.findByUsername(username);
            return new org.springframework.security.core.userdetails.User(
                    user.getUsername(),
                    user.getPassword(),
                    Collections.singletonList(new SimpleGrantedAuthority(user.getRole()))
            );
        }
    
}
