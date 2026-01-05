package com.example.project.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.json.simple.JSONObject;

import com.example.project.Model.ApplicationUser;
import com.example.project.repository.ApplicationUserRepository;
import com.example.project.security.JwtUtil;

@Service
public class ApplicationUserService {
    
    @Autowired
    private ApplicationUserRepository userRepository;
    
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Autowired
    private UserAuthService userAuthService;
    
    /**
     * Register a new user with encrypted password
     */
    public ApplicationUser registerUser(ApplicationUser user) {
        // Encode password before saving
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }
    
    /**
     * Authenticate user and generate JWT token
     */
    public ResponseEntity<?> authenticateUser(ApplicationUser loginRequest) {
        try {
            // Authenticate user credentials
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    loginRequest.getUser_name(), 
                    loginRequest.getPassword()
                )
            );
            
            // Generate JWT token
            String token = jwtUtil.generateToken(loginRequest.getUser_name());
            
            // Create JSON response with token
            JSONObject response = new JSONObject();
            response.put("token", token);
            
            // Create headers
            HttpHeaders headers = new HttpHeaders();
            headers.add("Content-Type", "application/json");
            
            return ResponseEntity.ok().headers(headers).body(response);
            
        } catch (Exception e) {
            // Authentication failed
            JSONObject error = new JSONObject();
            error.put("error", "Invalid username or password");
            error.put("message", e.getMessage());
            
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }
    }
    
    /**
     * Get user profile by username
     */
    public ApplicationUser getUserProfile(String username) {
        return userAuthService.findByUsername(username);
    }
    
    /**
     * Update user profile
     */
    public ApplicationUser updateUserProfile(String username, ApplicationUser updatedUser) {
        ApplicationUser existingUser = userAuthService.findByUsername(username);
        
        if (existingUser != null) {
            // Update only non-null fields
            if (updatedUser.getUser_email() != null && !updatedUser.getUser_email().isEmpty()) {
                existingUser.setUser_email(updatedUser.getUser_email());
            }
            if (updatedUser.getUser_mobile() != null && !updatedUser.getUser_mobile().isEmpty()) {
                existingUser.setUser_mobile(updatedUser.getUser_mobile());
            }
            if (updatedUser.getLocation() != null && !updatedUser.getLocation().isEmpty()) {
                existingUser.setLocation(updatedUser.getLocation());
            }
            // Don't update password here unless specifically requested
            
            return userRepository.save(existingUser);
        }
        
        return null;
    }
    
    /**
     * Check if user exists
     */
    public boolean userExists(String username) {
        return userRepository.existsById(username);
    }
    
    /**
     * Delete user account
     */
    public boolean deleteUser(String username) {
        if (userRepository.existsById(username)) {
            userRepository.deleteById(username);
            return true;
        }
        return false;
    }
}
