package com.wecp.car_rental_management_system.config;

import com.wecp.car_rental_management_system.jwt.JwtRequestFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class SecurityConfig extends WebSecurityConfigurerAdapter{

    // configure the security of the application such that
    // /api/user/register and /api/user/login are permitted to all
    // /api/administrator/car-categories is permitted to ADMINISTRATOR
    // /api/administrator/car-categories is permitted to ADMINISTRATOR
    // /api/administrator/car-categories/{categoryId} is permitted to ADMINISTRATOR
    // /api/administrator/reports/bookings is permitted to ADMINISTRATOR
    // /api/administrator/reports/payments is permitted to ADMINISTRATOR
    // /api/agent/car is permitted to AGENT
    // /api/agent/car/{carId} is permitted to AGENT
    // /api/agent/bookings is permitted to AGENT
    // /api/agent/bookings/{bookingId}/status is permitted to AGENT
    // /api/agent/payment/{bookingId}  is permitted to AGENT
    // /api/customers/cars/available is permitter to CUSTOMER
    // /api/customers/booking is permitter to CUSTOMER

    // note that check the permission with respect to authority
    // for example hasAuthority("ADMINISTRATOR")

    private final UserDetailsService userDetailsService;
    private final JwtRequestFilter jwtRequestFilter;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public SecurityConfig(UserDetailsService userDetailsService , JwtRequestFilter jwtRequestFilter , PasswordEncoder passwordEncoder)
    {
        this.userDetailsService = userDetailsService;
        this.jwtRequestFilter = jwtRequestFilter;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userDetailsService).passwordEncoder(passwordEncoder);
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.cors().and().csrf().disable()
                .authorizeRequests()
                .antMatchers("/api/user/register" , "/api/user/login").permitAll()
                .antMatchers(HttpMethod.POST , "/api/administrator/car-categories").hasAuthority("ADMINISTRATOR")
                .antMatchers(HttpMethod.GET , "/api/administrator/car-categories").hasAnyAuthority("ADMINISTRATOR","AGENT")
                .antMatchers(HttpMethod.PUT , "/api/administrator/car-categories/{categoryId}").hasAuthority("ADMINISTRATOR")
                .antMatchers(HttpMethod.GET , "/api/administrator/reports/bookings").hasAuthority("ADMINISTRATOR")
                .antMatchers(HttpMethod.GET , "/api/administrator/reports/payments").hasAuthority("ADMINISTRATOR")
                .antMatchers(HttpMethod.POST , "/api/agent/car").hasAuthority("AGENT")
                .antMatchers(HttpMethod.GET , "/api/agent/cars").hasAuthority("AGENT")
                .antMatchers(HttpMethod.PUT , "/api/agent/car/{carId}").hasAuthority("AGENT")
                .antMatchers(HttpMethod.GET , "/api/agent/bookings").hasAuthority("AGENT")
                .antMatchers(HttpMethod.PUT , "/api/agent/bookings/{bookingId}/status").hasAuthority("AGENT")
                .antMatchers(HttpMethod.POST , "/api/agent/payment/{bookingId}").hasAuthority("AGENT")
                .antMatchers(HttpMethod.GET , "/api/customers/cars/available").hasAuthority("CUSTOMER")
                .antMatchers(HttpMethod.POST , "/api/customers/booking").hasAuthority("CUSTOMER")
                .antMatchers(HttpMethod.GET , "/api/customers/bookings/{userId}").hasAuthority("CUSTOMER")
                .anyRequest().authenticated()
                .and()
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);

                http.addFilterBefore(jwtRequestFilter , UsernamePasswordAuthenticationFilter.class);
    }

    @Bean
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }
}