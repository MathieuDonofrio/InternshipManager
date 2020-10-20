package cal.internshipmanager.controller;

import cal.internshipmanager.model.InternshipOffer;
import cal.internshipmanager.request.*;
import cal.internshipmanager.response.InternshipOfferListResponse;
import cal.internshipmanager.response.UserListReponse;
import cal.internshipmanager.service.InternshipOfferService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

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
    public void create(@Valid @RequestBody InternshipOfferCreationRequest request) {
        internshipOfferService.create(request);
    }

    @PreAuthorize("hasAuthority('ADMINISTRATOR')")
    @PostMapping("approve")
    public void approve(@Valid @RequestBody InternshipOfferApproveRequest request) {
        internshipOfferService.approve(request);
    }

    @PreAuthorize("hasAuthority('ADMINISTRATOR')")
    @PostMapping("reject")
    public void reject(@Valid @RequestBody InternshipOfferRejectRequest request) {
        internshipOfferService.reject(request);
    }

    @PreAuthorize("hasAuthority('ADMINISTRATOR')")
    @PostMapping("add-user")
    public void addUser(@Valid @RequestBody InternshipOfferAddUserRequest request) {
        internshipOfferService.addUser(request);
    }

    @PreAuthorize("hasAuthority('ADMINISTRATOR')")
    @PostMapping("remove-user")
    public void removeUser(@Valid @RequestBody InternshipOfferRemoveUserRequest request) {
        internshipOfferService.removeUser(request);
    }

    //
    // Get
    //

    @PreAuthorize("hasAuthority('ADMINISTRATOR')")
    @GetMapping("pending-approval")
    public InternshipOfferListResponse pendingApproval() {
        return internshipOfferService.pendingApproval();
    }

    @PreAuthorize("hasAuthority('ADMINISTRATOR')")
    @GetMapping("rejected")
    public InternshipOfferListResponse rejected() {
        return internshipOfferService.rejected();
    }

    @PreAuthorize("hasAuthority('STUDENT') or hasAuthority('ADMINISTRATOR')")
    @GetMapping("approved")
    public InternshipOfferListResponse approved() {
        return internshipOfferService.approved();
    }

    @PreAuthorize("hasAuthority('ADMINISTRATOR')")
    @GetMapping("users/{uniqueId}")
    public UserListReponse users(@NotNull @PathVariable UUID uniqueId) {
        return internshipOfferService.users(uniqueId);
    }

    @PreAuthorize("hasAuthority('EMPLOYER')")
    @GetMapping("employer/{uniqueId}")
    public InternshipOfferListResponse findAllByEmployer(@PathVariable UUID uniqueId){
        return internshipOfferService.findAllByEmployer(uniqueId);
    }

}
