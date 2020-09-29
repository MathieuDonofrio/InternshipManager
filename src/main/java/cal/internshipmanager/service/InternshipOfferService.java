package cal.internshipmanager.service;

import cal.internshipmanager.model.InternshipOffer;
import cal.internshipmanager.repository.InternshipOfferRepository;
import cal.internshipmanager.request.InternshipOfferApproveRequest;
import cal.internshipmanager.request.InternshipOfferCreationRequest;
import cal.internshipmanager.request.InternshipOfferRejectRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import javax.validation.Valid;
import java.util.Date;
import java.util.UUID;

@Service
@Validated
public class InternshipOfferService {

    //
    // Dependencies
    //

    private final InternshipOfferRepository internshipOfferRepository;

    //
    // Constructors
    //

    @Autowired
    public InternshipOfferService(InternshipOfferRepository internshipOfferRepository) {
        this.internshipOfferRepository = internshipOfferRepository;
    }

    //
    // Services
    //

    public void createInternshipOffer(@Valid InternshipOfferCreationRequest request) {

        final Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        UUID user = UUID.fromString((String) authentication.getPrincipal());

        InternshipOffer internshipOffer = new InternshipOffer();

        internshipOffer.setUniqueId(UUID.randomUUID());
        internshipOffer.setEmployer(user);
        internshipOffer.setStatus(InternshipOffer.Status.PENDING_APPROVAL);
        internshipOffer.setCompany(request.getCompany());
        internshipOffer.setDuration(request.getDuration());
        internshipOffer.setHours(request.getHours());
        internshipOffer.setJobScope(request.getJobScope());
        internshipOffer.setJobTitle(request.getJobTitle());
        internshipOffer.setSalary(request.getSalary());
        internshipOffer.setStartDate(new Date(request.getStartDate()));

        internshipOfferRepository.save(internshipOffer);
    }

    public void approveInternshipOffer(@Valid InternshipOfferApproveRequest request){

        InternshipOffer internshipOffer = internshipOfferRepository.findById(request.getUniqueId()).orElse(null);

        internshipOffer.setStatus(InternshipOffer.Status.APPROVED);

        internshipOfferRepository.save(internshipOffer);
    }

    public void rejectInternshipOffer(@Valid InternshipOfferRejectRequest request){

        InternshipOffer internshipOffer = internshipOfferRepository.findById(request.getUniqueId()).orElse(null);

        internshipOffer.setStatus(InternshipOffer.Status.REJECTED);

        internshipOfferRepository.save(internshipOffer);
    }

}
