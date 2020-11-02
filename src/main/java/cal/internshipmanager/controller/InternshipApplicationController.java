package cal.internshipmanager.controller;

import cal.internshipmanager.model.InternshipApplication;
import cal.internshipmanager.request.InternshipApplicationCreationRequest;
import cal.internshipmanager.response.InternshipApplicationListResponse;
import cal.internshipmanager.response.PortfolioDocumentListResponse;
import cal.internshipmanager.service.InternshipApplicationService;
import cal.internshipmanager.validator.ExistingInternshipApplication;
import cal.internshipmanager.validator.ExistingInternshipOffer;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
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
    // Get
    //

    @GetMapping("internship-applications/{userUniqueId}")
    public InternshipApplicationListResponse internshipApplications(@PathVariable UUID userUniqueId) {
        return internshipApplicationService.internshipApplications(userUniqueId);
    }

    @GetMapping("{status}")
    public InternshipApplicationListResponse findByStatus(@Valid @NotNull @PathVariable InternshipApplication.Status status) {
        return internshipApplicationService.findByStatus(status);
    }

    @GetMapping("offer/{uniqueId}")
    public InternshipApplicationListResponse findByOffer(@Valid @PathVariable @ExistingInternshipOffer UUID uniqueId) {
        return internshipApplicationService.findByOffer(uniqueId);
    }

    @GetMapping("documents/{uniqueId}")
    public PortfolioDocumentListResponse applicationDocuments(@Valid @PathVariable @ExistingInternshipApplication UUID uniqueId) {
        return internshipApplicationService.applicationDocuments(uniqueId);
    }

    //
    // Put
    //

    @PutMapping("approve/{applicationId}")
    public void approve(@Valid @ExistingInternshipApplication @PathVariable UUID applicationId) {
        System.out.println("WHYYYYYYYYYYYYYYYYYYYYY");
        internshipApplicationService.approve(applicationId);
    }

    @PutMapping("reject/{applicationId}")
    public void reject(@Valid @ExistingInternshipApplication @PathVariable UUID applicationId) {
        internshipApplicationService.reject(applicationId);
    }

    @PutMapping("select/{applicationId}")
    public void select(@Valid @ExistingInternshipApplication @PathVariable UUID applicationId) {
        internshipApplicationService.select(applicationId);
    }

    //
    // Post
    //

    @PostMapping("create")
    public void create(@Valid @RequestBody InternshipApplicationCreationRequest request) {
        System.out.println("THE MONSTER HAS");
        internshipApplicationService.create(request);
    }

}
