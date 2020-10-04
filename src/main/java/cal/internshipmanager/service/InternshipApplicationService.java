package cal.internshipmanager.service;

import cal.internshipmanager.model.InternshipApplication;
import cal.internshipmanager.repository.InternshipApplicationRepository;
import cal.internshipmanager.request.InternshipApplicationCreationRequest;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import javax.validation.Valid;
import java.util.Date;
import java.util.UUID;

@Service
@Validated
public class InternshipApplicationService {

    //
    // Dependencies
    //

    private final InternshipApplicationRepository internshipApplicationRepository;

    //
    // Constructors
    //

    public InternshipApplicationService(InternshipApplicationRepository internshipApplicationRepository) {
        this.internshipApplicationRepository = internshipApplicationRepository;
    }

    //
    // Services
    //

    public void createApplicationOffer(@Valid InternshipApplicationCreationRequest request) {

        final Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        UUID user = UUID.fromString((String) authentication.getPrincipal());

        InternshipApplication internshipApplication = new InternshipApplication();

        internshipApplication.setUniqueId(UUID.randomUUID());
        internshipApplication.setStudentUniqueId(user);
        internshipApplication.setOfferUniqueId(request.getOfferUniqueId());
        internshipApplication.setDate(new Date());

        internshipApplicationRepository.save(internshipApplication);
    }
}
