package com.wecp.car_rental_management_system.controller;


import com.wecp.car_rental_management_system.dto.LoginRequest;
import com.wecp.car_rental_management_system.dto.LoginResponse;
import com.wecp.car_rental_management_system.entity.User;
import com.wecp.car_rental_management_system.jwt.JwtUtil;
import com.wecp.car_rental_management_system.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
public class RegisterAndLoginController {

    @Autowired
    JwtUtil jwtUtil;

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    private UserService userService;
    
    @PostMapping("/api/user/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        try{
            return ResponseEntity.ok(userService.registerUser(user));
        } catch(Exception ex) {
            return new ResponseEntity<>(ex.getMessage() , HttpStatus.CONFLICT);
        }
    }
 
    @PostMapping("/api/user/login")
    public ResponseEntity<LoginResponse> loginUser(@RequestBody LoginRequest loginRequest) {
        User foundUser = userService.getUserByUsername(loginRequest.getUsername());
            if (foundUser == null) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found");
            }
         
            try {
                authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
                );
            } catch (AuthenticationException e) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid username or password", e);
            }
         
            final String token = jwtUtil.generateToken(foundUser.getUsername());
            return ResponseEntity.ok(
                new LoginResponse(
                    foundUser.getId(), token, foundUser.getUsername(), foundUser.getEmail(), foundUser.getRole()
                )
            );
    }
}

