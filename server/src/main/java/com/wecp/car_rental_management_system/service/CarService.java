package com.wecp.car_rental_management_system.service;

import com.wecp.car_rental_management_system.entity.Car;
import com.wecp.car_rental_management_system.repository.CarRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CarService {
    // implement car service
    @Autowired
    private CarRepository carRepository;
 
    public Car addCar(Car car){
        return carRepository.save(car);
    }

    public Car getCarById(Long carId){
        return carRepository.findById(carId).get();
    }
 
    public List<Car> getAllCars(){
        return carRepository.findAll();
    }
 
    public Car updateCar(Long id, Car car){
        car.setId(id);
        return carRepository.save(car);
    }
 
    public List<Car>getAvailableCars(){
        return carRepository.findByStatus("available");
    }
}
