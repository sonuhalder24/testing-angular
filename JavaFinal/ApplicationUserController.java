// package com.example.project.controller;

// import com.example.project.Model.ApplicationUser;
// import com.example.project.security.JwtUtil;
// import com.example.project.service.UserAuthService;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.http.ResponseEntity;
// import org.springframework.security.authentication.AuthenticationManager;
// import org.springframework.security.authentication.BadCredentialsException;
// import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
// import org.springframework.security.core.userdetails.UserDetails;
// import org.springframework.web.bind.annotation.*;

// import java.util.HashMap;
// import java.util.Map;

// @RestController
// @CrossOrigin
// public class ApplicationUserController {

//     @Autowired
//     private AuthenticationManager authenticationManager;

//     @Autowired
//     private UserAuthService userAuthService;

//     @Autowired
//     private JwtUtil jwtUtil;

//     @PostMapping("/register")
//     public ResponseEntity<?> registerUser(@RequestBody ApplicationUser user) {
//         ApplicationUser savedUser = userAuthService.save(user);
//         Map<String, String> response = new HashMap<>();
//         response.put("message", "User registered successfully");
//         return ResponseEntity.ok(response);
//     }

//     @PostMapping("/signin")
//     public ResponseEntity<?> createAuthenticationToken(@RequestBody ApplicationUser authenticationRequest) throws Exception {
//         try {
//             authenticationManager.authenticate(
//                     new UsernamePasswordAuthenticationToken(
//                             authenticationRequest.getUser_name(), 
//                             authenticationRequest.getPassword())
//             );
//         } catch (BadCredentialsException e) {
//             throw new Exception("Incorrect username or password", e);
//         }

//         final UserDetails userDetails = userAuthService.loadUserByUsername(authenticationRequest.getUser_name());
//         final String jwt = jwtUtil.generateToken(userDetails.getUsername());

//         Map<String, String> response = new HashMap<>();
//         response.put("token", jwt);
//         return ResponseEntity.ok(response);
//     }

//     @GetMapping("/viewprofile/{username}")
//     public ResponseEntity<?> getUserProfile(@PathVariable String username) {
//         ApplicationUser user = userAuthService.findByUsername(username);
//         if (user != null) {
//             return ResponseEntity.ok(user);
//         }
//         return ResponseEntity.notFound().build();
//     }
// }


package com.example.project.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.HashMap;
import java.util.Map;

import com.example.project.Model.ApplicationUser;
import com.example.project.service.UserAuthService;
import com.example.project.security.JwtUtil;

@RestController
public class ApplicationUserController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserAuthService userAuthService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody ApplicationUser user) {
        try {
            ApplicationUser savedUser = userAuthService.save(user);
            Map<String, String> response = new HashMap<>();
            response.put("message", "User registered successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Registration failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    @PostMapping("/signin")
    public ResponseEntity<?> createAuthenticationToken(@RequestBody ApplicationUser authenticationRequest) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            authenticationRequest.getUser_name(), 
                            authenticationRequest.getPassword())
            );
        } catch (BadCredentialsException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Incorrect username or password");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }

        final UserDetails userDetails = userAuthService.loadUserByUsername(authenticationRequest.getUser_name());
        final String jwt = jwtUtil.generateToken(userDetails.getUsername());
        
        // Get user ID for response
        ApplicationUser user = userAuthService.findByUsername(authenticationRequest.getUser_name());

        Map<String, String> response = new HashMap<>();
        response.put("token", jwt);
        response.put("id", user.getUser_name()); // or user ID if you have a separate ID field
        return ResponseEntity.ok(response);
    }

    @GetMapping("/viewprofile/{username}")
    public ResponseEntity<?> getUserProfile(@PathVariable String username) {
        ApplicationUser user = userAuthService.findByUsername(username);
        if (user != null) {
            return ResponseEntity.ok(user);
        }
        Map<String, String> error = new HashMap<>();
        error.put("error", "User not found");
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }
    
    @PutMapping("/updateprofile/{username}")
    public ResponseEntity<?> updateUserProfile(@PathVariable String username, @RequestBody ApplicationUser updatedUser) {
        ApplicationUser existingUser = userAuthService.findByUsername(username);
        
        if (existingUser == null) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "User not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
        
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
        
        ApplicationUser savedUser = userAuthService.save(existingUser);
        return ResponseEntity.ok(savedUser);
    }
}
