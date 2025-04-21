package com.teamf.pulse.controller;

import com.teamf.pulse.model.Project;
import com.teamf.pulse.model.ProjectStatus;
import com.teamf.pulse.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {
    private static final Logger logger = LoggerFactory.getLogger(ProjectController.class);

    @Autowired
    private ProjectRepository projectRepository;

    @GetMapping
    public List<Project> getAllProjects() {
        logger.info("Fetching all projects");
        return projectRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Project> getProjectById(@PathVariable Long id) {
        logger.info("Fetching project with id: {}", id);
        return projectRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Project createProject(@RequestBody Project project) {
        logger.info("Creating new project: {}", project);
        try {
            // Set initial status and start date
            project.setStatus(ProjectStatus.ACTIVE);
            project.setStartDate(LocalDateTime.now());
            Project savedProject = projectRepository.save(project);
            logger.info("Project created successfully: {}", savedProject);
            return savedProject;
        } catch (Exception e) {
            logger.error("Error creating project: {}", e.getMessage(), e);
            throw e;
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Project> updateProject(@PathVariable Long id, @RequestBody Project projectDetails) {
        logger.info("Updating project with id: {}", id);
        return projectRepository.findById(id)
                .map(project -> {
                    project.setName(projectDetails.getName());
                    project.setDescription(projectDetails.getDescription());
                    Project updatedProject = projectRepository.save(project);
                    logger.info("Project updated successfully: {}", updatedProject);
                    return ResponseEntity.ok(updatedProject);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Project> updateProjectStatus(
            @PathVariable Long id,
            @RequestBody ProjectStatus newStatus) {
        logger.info("Updating status for project id: {} to status: {}", id, newStatus);
        return projectRepository.findById(id)
                .map(project -> {
                    project.setStatus(newStatus);
                    // Set end date when project is completed
                    if (newStatus == ProjectStatus.COMPLETED) {
                        project.setEndDate(LocalDateTime.now());
                    }
                    Project updatedProject = projectRepository.save(project);
                    logger.info("Project status updated successfully: {}", updatedProject);
                    return ResponseEntity.ok(updatedProject);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProject(@PathVariable Long id) {
        logger.info("Deleting project with id: {}", id);
        return projectRepository.findById(id)
                .map(project -> {
                    projectRepository.delete(project);
                    logger.info("Project deleted successfully");
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
} 