package com.example.project.service;

import java.util.Arrays;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import com.example.project.Model.ApplicationUser;
import com.example.project.repository.ApplicationUserRepository;

@Service
public class UserAuthService implements UserDetailsService {
    
    @Autowired
    private ApplicationUserRepository userRepository;
    
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Find user by username
        Optional<ApplicationUser> userOptional = userRepository.findById(username);
        
        if (!userOptional.isPresent()) {
            throw new UsernameNotFoundException("User not found with username: " + username);
        }
        
        ApplicationUser user = userOptional.get();
        
        // Create and return UserDetails object
        return new org.springframework.security.core.userdetails.User(
            user.getUser_name(),
            user.getPassword(),
            Arrays.asList(new SimpleGrantedAuthority("ROLE_USER"))
        );
    }
    
    // Find user by username
    public ApplicationUser findByUsername(String username) {
        Optional<ApplicationUser> user = userRepository.findById(username);
        return user.orElse(null);
    }
}
