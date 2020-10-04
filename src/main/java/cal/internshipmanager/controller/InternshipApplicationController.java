package cal.internshipmanager.controller;

import cal.internshipmanager.request.InternshipApplicationCreationRequest;
import cal.internshipmanager.service.InternshipApplicationService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

@RestController
@RequestMapping("/internshipapplication")
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
    public void createApplicationOffer(@Valid @RequestBody InternshipApplicationCreationRequest request) {
        internshipApplicationService.createApplicationOffer(request);
    }
}
