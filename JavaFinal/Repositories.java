// ApplicationUserRepository.java
package com.example.project.repository;

import com.example.project.Model.ApplicationUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;



@Repository
public interface ApplicationUserRepository extends JpaRepository<ApplicationUser, String> {
    @Query("SELECT u from ApplicationUser u WHERE u.user_name = :userName")
    ApplicationUser findByUser_name(@Param("userName") String userName);
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
