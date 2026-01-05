// ApplicationUserRepository.java
package com.example.project.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.project.Model.ApplicationUser;

@Repository
public interface ApplicationUserRepository extends JpaRepository<ApplicationUser, String> {
    ApplicationUser findByUserName(String userName);
}

// ========================================

// PatientRepository.java
package com.example.project.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.project.Model.Patient;

@Repository
public interface PatientRepository extends JpaRepository<Patient, String> {
}

// ========================================

// AppointmentRepository.java
package com.example.project.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.project.Model.Appointment;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, String> {
}
