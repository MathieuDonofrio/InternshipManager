package cal.internshipmanager.controller;

import cal.internshipmanager.model.InternshipApplication;
import cal.internshipmanager.request.InternshipApplicationCreationRequest;
import cal.internshipmanager.request.InternshipApplicationEditRequest;
import cal.internshipmanager.response.InternshipApplicationListResponse;
import cal.internshipmanager.service.InternshipApplicationService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

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

    // GET

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

    //PUT

    @PutMapping
    public void edit(@RequestBody @Valid InternshipApplicationEditRequest request) {
        internshipApplicationService.editStatus(request);
    }

    //POST

    @PreAuthorize("hasAuthority('STUDENT')")
    @PostMapping("create")
    public void create(@Valid @RequestBody InternshipApplicationCreationRequest request) {
        internshipApplicationService.create(request);
    }

}
