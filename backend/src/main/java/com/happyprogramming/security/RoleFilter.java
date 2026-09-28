package com.happyprogramming.security;

import jakarta.servlet.*;
import jakarta.servlet.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;

/*
 * Demo filter following the architecture's Spring Security Filter layer.
 * Replace X-Role with real authentication/JWT after the Sign in requirement is implemented.
 */
@Component
public class RoleFilter extends OncePerRequestFilter {
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain)
            throws ServletException, IOException {
        chain.doFilter(req, res);
    }
}
