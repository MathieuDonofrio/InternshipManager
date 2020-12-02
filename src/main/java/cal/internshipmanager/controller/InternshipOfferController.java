package cal.internshipmanager.controller;

import cal.internshipmanager.request.*;
import cal.internshipmanager.response.InternshipOfferListResponse;
import cal.internshipmanager.response.UserListReponse;
import cal.internshipmanager.service.InternshipOfferService;
import cal.internshipmanager.validator.ExistingInternshipOffer;
import cal.internshipmanager.validator.ExistingUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.UUID;

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

    @PostMapping("create")
    public UUID create(@Valid @RequestBody InternshipOfferCreationRequest request) {
        return internshipOfferService.create(request);
    }

    //
    // Put
    //

    @PreAuthorize("hasAuthority('ADMINISTRATOR')")
    @PutMapping("approve/{uniqueId}")
    public void approve(@Valid @ExistingInternshipOffer @PathVariable UUID uniqueId) {
        internshipOfferService.approve(uniqueId);
    }
    @PreAuthorize("hasAuthority('ADMINISTRATOR')")
    @PutMapping("reject/{uniqueId}")
    public void reject(@Valid @ExistingInternshipOffer @PathVariable UUID uniqueId) {
        internshipOfferService.reject(uniqueId);
    }
    @PreAuthorize("hasAuthority('ADMINISTRATOR')")
    @PutMapping("add-user")
    public void addUser(@Valid @RequestBody InternshipOfferAddUserRequest request) {
        internshipOfferService.addUser(request);
    }
    @PreAuthorize("hasAuthority('ADMINISTRATOR')")
    @PutMapping("remove-user")
    public void removeUser(@Valid @RequestBody InternshipOfferRemoveUserRequest request) {
        internshipOfferService.removeUser(request);
    }

    //
    // Get
    //
    @GetMapping("pending-approval")
    public InternshipOfferListResponse pendingApproval() {
        return internshipOfferService.pendingApproval();
    }

    @GetMapping("approved")
    public InternshipOfferListResponse approved() {
        return internshipOfferService.approved();
    }

    @GetMapping("rejected")
    public InternshipOfferListResponse rejected() {
        return internshipOfferService.rejected();
    }

    @GetMapping("accessible/{userUniqueId}")
    public InternshipOfferListResponse accessible(@Valid @ExistingUser @PathVariable UUID userUniqueId) {
        return internshipOfferService.accessible(userUniqueId);
    }

    @GetMapping("users/{uniqueId}")
    public UserListReponse users(@Valid @ExistingInternshipOffer @PathVariable UUID uniqueId) {
        return internshipOfferService.users(uniqueId);
    }

    @GetMapping("employer/{userUniqueId}")
    public InternshipOfferListResponse findAllByEmployer(@Valid @ExistingUser @PathVariable UUID userUniqueId){
        return internshipOfferService.findAllByEmployer(userUniqueId);
    }

    @GetMapping("employer/pending/{userUniqueId}")
    public InternshipOfferListResponse findAllPendingByEmployer(@Valid @ExistingUser @PathVariable UUID userUniqueId){
        return internshipOfferService.findAllPendingByEmployer(userUniqueId);
    }

    @GetMapping("employer/rejected/{userUniqueId}")
    public InternshipOfferListResponse findAllRejectedByEmployer(@Valid @ExistingUser @PathVariable UUID userUniqueId){
        return internshipOfferService.findAllRejectedByEmployer(userUniqueId);
    }

    @GetMapping("{uniqueId}")
    public InternshipOfferListResponse.InternshipOffer find(@Valid @ExistingInternshipOffer @PathVariable UUID uniqueId){
        return internshipOfferService.find(uniqueId);
    }

}
