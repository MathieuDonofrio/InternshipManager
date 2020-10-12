package cal.internshipmanager.controller;

import cal.internshipmanager.request.InternshipApplicationCreationRequest;
import cal.internshipmanager.request.InternshipApplicationEditRequest;
import cal.internshipmanager.request.InternshipApplicationFindByStatusRequest;
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

    @GetMapping()
    public InternshipApplicationListResponse findByStatus(@RequestBody @Valid InternshipApplicationFindByStatusRequest request) {
        return internshipApplicationService.findByStatus(request);
    }

    @PutMapping()
    public void editStatus(@RequestBody @Valid InternshipApplicationEditRequest request) {
        internshipApplicationService.editStatus(request);
    }

}
