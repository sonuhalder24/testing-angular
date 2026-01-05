package com.example.project.security;

import java.io.IOException;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import com.example.project.Model.ApplicationUser;
import com.example.project.service.UserAuthService;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private UserAuthService userAuthService;

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                    HttpServletResponse response, 
                                    FilterChain filterChain)
            throws ServletException, IOException {

        // Extract Authorization header
        final String authorizationHeader = request.getHeader("Authorization");

        String username = null;
        String jwt = null;

        // Check if Authorization header is present and starts with "Bearer "
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            jwt = authorizationHeader.substring(7); // Extract token (remove "Bearer ")
            
            try {
                // Extract username from token
                username = jwtUtil.extractUsername(jwt);
            } catch (Exception e) {
                // Invalid token - log and continue
                logger.error("JWT Token extraction failed: " + e.getMessage());
            }
        }

        // If username is extracted and no authentication is set in context
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            
            // Load user details from database
            UserDetails userDetails = this.userAuthService.loadUserByUsername(username);

            // Validate token against username
            if (jwtUtil.validateToken(jwt, userDetails.getUsername())) {
                
                // Create authentication token
                UsernamePasswordAuthenticationToken authenticationToken = 
                    new UsernamePasswordAuthenticationToken(
                        userDetails, 
                        null, 
                        userDetails.getAuthorities()
                    );
                
                // Set request details
                authenticationToken.setDetails(
                    new WebAuthenticationDetailsSource().buildDetails(request)
                );
                
                // Set authentication in security context
                SecurityContextHolder.getContext().setAuthentication(authenticationToken);
            }
        }
        
        // Continue filter chain
        filterChain.doFilter(request, response);
    }
}
