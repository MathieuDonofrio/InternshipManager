package cal.internshipmanager.controller;

import cal.internshipmanager.request.InternshipOfferValidateRequest;
import cal.internshipmanager.request.InternshipOfferCreationRequest;
import cal.internshipmanager.service.InternshipOfferService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

@RestController
@RequestMapping("/internshipoffer")
public class InternshipOfferController {

    //
    // Dependencies
    //

    private final InternshipOfferService internshipOfferService;

    //
    // Constructors
    //

    public InternshipOfferController(InternshipOfferService internshipOfferService) {
        this.internshipOfferService = internshipOfferService;
    }

    //
    // Services
    //

    @PreAuthorize("hasAuthority('EMPLOYER')")
    @PostMapping("create")
    public void createInternshipOffer(@Valid @RequestBody InternshipOfferCreationRequest internshipOfferCreationRequest) {
        internshipOfferService.createInternshipOffer(internshipOfferCreationRequest);
    }

    @PreAuthorize("hasAuthority('ADMINISTRATOR')")
    @PostMapping("validate")
    public void InternshipOfferStatusRequest(@Valid @RequestBody InternshipOfferValidateRequest request){
        internshipOfferService.validateInternshipOffer(request);
    }



}
