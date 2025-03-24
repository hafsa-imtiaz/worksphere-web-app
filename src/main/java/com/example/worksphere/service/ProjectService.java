package com.example.worksphere.service;

import com.example.worksphere.entity.Project;
import com.example.worksphere.repository.ProjectRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;

    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    public Optional<Project> getProjectById(Long id) {
        return projectRepository.findById(id);
    }

    public List<Project> getProjectsByOwner(Long ownerId) {
        return projectRepository.findByOwnerId(ownerId);
    }

    public Project createProject(Project project) {
        return projectRepository.save(project);
    }

    public Project updateProject(Long id, Project updatedProject) {
        return projectRepository.findById(id)
                .map(existingProject -> {
                    existingProject.setName(updatedProject.getName());
                    existingProject.setDescription(updatedProject.getDescription());
                    existingProject.setStatus(updatedProject.getStatus());
                    existingProject.setVisibility(updatedProject.getVisibility());
                    existingProject.setProgress(updatedProject.getProgress());
                    existingProject.setStartDate(updatedProject.getStartDate());
                    existingProject.setEndDate(updatedProject.getEndDate());
                    return projectRepository.save(existingProject);
                })
                .orElseThrow(() -> new RuntimeException("Project not found"));
    }

    public void deleteProject(Long id) {
        projectRepository.deleteById(id);
    }
}
