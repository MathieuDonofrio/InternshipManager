package cal.internshipmanager.controller;

import cal.internshipmanager.model.InternshipApplication;
import cal.internshipmanager.request.InternshipApplicationCreationRequest;
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

    //
    // Get
    //

    @GetMapping("internship-applications/{userUniqueId}")
    public InternshipApplicationListResponse internshipApplications(@PathVariable UUID userUniqueId) {
        return internshipApplicationService.internshipApplications(userUniqueId);
    }

    @GetMapping("{status}")
    public InternshipApplicationListResponse findByStatus(@PathVariable @Valid InternshipApplication.Status status) {
        return internshipApplicationService.findByStatus(status);
    }

    @PreAuthorize("hasAuthority('EMPLOYER')")
    @GetMapping("offer/{uniqueId}")
    public InternshipApplicationListResponse findByOffer(@PathVariable UUID uniqueId) {
        return internshipApplicationService.findByOffer(uniqueId);
    }

    //
    //Put
    //


    @PreAuthorize("hasAuthority('EMPLOYER')")
    @PutMapping("approve/{applicationId}")
    public void approve(@PathVariable UUID applicationId){
        internshipApplicationService.approve(applicationId);
    }

    @PreAuthorize("hasAuthority('EMPLOYER')")
    @PutMapping("reject/{applicationId}")
    public void reject(@PathVariable UUID applicationId){
        internshipApplicationService.reject(applicationId);
    }

    //
    // Post
    //

    @PreAuthorize("hasAuthority('STUDENT')")
    @PostMapping("create")
    public void create(@Valid @RequestBody InternshipApplicationCreationRequest request) {
        internshipApplicationService.create(request);
    }

}
