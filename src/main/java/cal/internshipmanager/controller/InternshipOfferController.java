package cal.internshipmanager.controller;

import cal.internshipmanager.request.*;
import cal.internshipmanager.response.InternshipOfferListResponse;
import cal.internshipmanager.service.InternshipOfferService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

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
    // Post
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

    @PreAuthorize("hasAuthority('ADMINISTRATOR')")
    @PostMapping("add-user")
    public void addUserInternshipOffer(@Valid @RequestBody InternshipOfferAddUserRequest request){
        internshipOfferService.addUserToInternshipOffer(request);
    }

    @PreAuthorize("hasAuthority('ADMINISTRATOR')")
    @PostMapping("remove-user")
    public void addUserInternshipOffer(@Valid @RequestBody InternshipOfferRemoveUserRequest request){
        internshipOfferService.removeUserToInternshipOffer(request);
    }

    //
    // Get
    //

    @PreAuthorize("hasAuthority('ADMINISTRATOR')")
    @GetMapping("pending-approval")
    public InternshipOfferListResponse pendingApprovalInternshipOffers(){
        return internshipOfferService.pendingApprovalInternshipOffers();
    }

    @PreAuthorize("hasAuthority('ADMINISTRATOR')")
    @GetMapping("rejected")
    public InternshipOfferListResponse rejectedInternshipOffers(){
        return internshipOfferService.pendingApprovalInternshipOffers();
    }

    @GetMapping("approved")
    public InternshipOfferListResponse approvedInternshipOffers(){
        return internshipOfferService.approvedInternshipOffers();
    }

}
