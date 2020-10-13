package cal.internshipmanager.controller;

import cal.internshipmanager.model.InternshipApplication;
import cal.internshipmanager.request.InternshipApplicationCreationRequest;
import cal.internshipmanager.request.InternshipApplicationEditRequest;
import cal.internshipmanager.response.InternshipApplicationListResponse;
import cal.internshipmanager.service.InternshipApplicationService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.UUID;

@RestController
@RequestMapping("/internship-application")
public class InternshipApplicationController {

    //
    // Dependencies
    //

    private final InternshipApplicationService internshipApplicationService;

    //
    // Constructors
    //

    public InternshipApplicationController(InternshipApplicationService internshipApplicationService) {
        this.internshipApplicationService = internshipApplicationService;
    }

    //
    // Services
    //

    @PreAuthorize("hasAuthority('STUDENT')")
    @PostMapping("create")
    public void create(@Valid @RequestBody InternshipApplicationCreationRequest request) {
        internshipApplicationService.create(request);
    }

    @GetMapping("internship-applications/{userUniqueId}")
    public InternshipApplicationListResponse internshipApplications(@PathVariable UUID userUniqueId) {
        return internshipApplicationService.internshipApplications(userUniqueId);
    }

    @GetMapping("{status}")
    public InternshipApplicationListResponse findByStatus(@PathVariable @Valid InternshipApplication.Status status) {
        return internshipApplicationService.findByStatus(status);
    }

    @PutMapping
    public void editStatus(@RequestBody @Valid InternshipApplicationEditRequest request) {
        internshipApplicationService.editStatus(request);
    }

}
