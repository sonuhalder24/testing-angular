package com.example.project.service;

import com.example.project.Model.Appointment;
import com.example.project.repository.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AppointmentService {
    
    @Autowired
    private AppointmentRepository appointmentRepository;
    
    public Appointment bookAppointment(Appointment appointment) {
        return appointmentRepository.save(appointment);
    }
}
