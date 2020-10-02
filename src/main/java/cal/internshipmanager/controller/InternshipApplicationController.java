package cal.internshipmanager.controller;

import cal.internshipmanager.request.InternshipApplicationCreationRequest;
import cal.internshipmanager.request.InternshipOfferCreationRequest;
import cal.internshipmanager.service.ApplicationOfferService;
import cal.internshipmanager.service.InternshipOfferService;
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

    private final ApplicationOfferService applicationOfferService;

    //
    // Constructors
    //

    public InternshipApplicationController(ApplicationOfferService applicationOfferService) {
        this.applicationOfferService = applicationOfferService;
    }

    //
    // Services
    //

    @PreAuthorize("hasAuthority('STUDENT')")
    @PostMapping("create")
    public void createApplicationOffer(@Valid @RequestBody InternshipApplicationCreationRequest internshipApplicationCreationRequest) {
        applicationOfferService.createApplicationOffer(internshipApplicationCreationRequest);
    }
}
