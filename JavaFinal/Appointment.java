package com.example.project.Model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import org.hibernate.annotations.GenericGenerator;
import java.util.Date;

@Entity
@Table(name = "appointment")
public class Appointment {
    
    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "uuid2")
    private String booking_id;
    private String disease;
    private Date tentativedate;
    private String priority;
    private String patientId;
    
    public Appointment() {
    }
    
    public Appointment(String disease, Date tentativedate, String priority, String patientId) {
        this.disease = disease;
        this.tentativedate = tentativedate;
        this.priority = priority;
        this.patientId = patientId;
    }

    public String getBooking_id() {
        return booking_id;
    }

    public void setBooking_id(String booking_id) {
        this.booking_id = booking_id;
    }

    public String getDisease() {
        return disease;
    }

    public void setDisease(String disease) {
        this.disease = disease;
    }

    public Date getTentativedate() {
        return tentativedate;
    }

    public void setTentativedate(Date tentativedate) {
        this.tentativedate = tentativedate;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public String getPatientId() {
        return patientId;
    }

    public void setPatientId(String patientId) {
        this.patientId = patientId;
    }
}
