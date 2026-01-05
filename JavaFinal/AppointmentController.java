package com.example.project.controller;

import com.example.project.Model.Appointment;
import com.example.project.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin
@RequestMapping("/appointment")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @PostMapping("/register")
    public ResponseEntity<?> bookAppointment(@RequestBody Appointment appointment) {
        Appointment savedAppointment = appointmentService.bookAppointment(appointment);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Appointment booked successfully");
        return ResponseEntity.ok(response);
    }
}
