package com.teamf.pulse.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {

    @GetMapping("/")
    public String healthCheck() {
        return "Pulse Backend Service is running!";
    }

    @GetMapping("/health")
    public String health() {
        return "OK";
    }
} 