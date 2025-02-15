package com.wecp.car_rental_management_system.service;

import com.wecp.car_rental_management_system.entity.CarCategory;
import com.wecp.car_rental_management_system.repository.CarCategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CarCategoryService {
    // implement car category service
    @Autowired
    private CarCategoryRepository carCategoryRepository;

    // Add a new car category
    public CarCategory addCarCategory(CarCategory carCategory) {

        String name = carCategory.getName();
         
        if(carCategoryRepository.existsByName(name)){
            return null;
        }
        
        return carCategoryRepository.save(carCategory);
    }

    // Get all car categories
    public List<CarCategory> getAllCarCategories() {
        return carCategoryRepository.findAll();
    }

    // Get a car category by ID
    public CarCategory getCarCategoryById(Long id) {
        return carCategoryRepository.findById(id).orElse(null);
    }

    // Update a car category
    public CarCategory updateCarCategory(Long id, CarCategory updatedCarCategory) {
        CarCategory existingCarCategory = carCategoryRepository.findById(id).orElse(null);
        if (existingCarCategory != null) {
            existingCarCategory.setName(updatedCarCategory.getName());
            existingCarCategory.setDescription(updatedCarCategory.getDescription());
            existingCarCategory.setBaseRate(updatedCarCategory.getBaseRate());
            return carCategoryRepository.save(existingCarCategory);
        }
        return null;
    }

    // Delete a car category
    public void deleteCarCategory(Long id) {
        carCategoryRepository.deleteById(id);
    }
}



