package cal.internshipmanager.controller;

import cal.internshipmanager.request.InternshipOfferApproveRequest;
import cal.internshipmanager.request.InternshipOfferCreationRequest;
import cal.internshipmanager.request.InternshipOfferRejectRequest;
import cal.internshipmanager.service.InternshipOfferService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

@RestController
@RequestMapping("/internship-offer")
public class InternshipOfferController {

    //
    // Dependencies
    //

    private final InternshipOfferService internshipOfferService;

    //
    // Constructors
    //

    @Autowired
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
    @PostMapping("approve")
    public void approveInternshipOffer(@Valid @RequestBody InternshipOfferApproveRequest request){
        internshipOfferService.approveInternshipOffer(request);
    }

    @PreAuthorize("hasAuthority('ADMINISTRATOR')")
    @PostMapping("reject")
    public void rejectInternshipOffer(@Valid @RequestBody InternshipOfferRejectRequest request){
        internshipOfferService.rejectInternshipOffer(request);
    }

}
