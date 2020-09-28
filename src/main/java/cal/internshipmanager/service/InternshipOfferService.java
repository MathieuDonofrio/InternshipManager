package cal.internshipmanager.service;

import cal.internshipmanager.model.InternshipOffer;
import cal.internshipmanager.repository.InternshipOfferRepository;
import cal.internshipmanager.request.InternshipOfferValidateRequest;
import cal.internshipmanager.request.InternshipOfferCreationRequest;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import javax.validation.Valid;
import java.util.Date;
import java.util.Optional;
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

    public InternshipOfferService(InternshipOfferRepository internshipOfferRepository) {
        this.internshipOfferRepository = internshipOfferRepository;
    }

    /**
     * Create an intership Offer as an employer if the request is valid.
     *
     * @param request internship offer creation request
     * @return internship offer creation response
     */
    public void createInternshipOffer(@Valid InternshipOfferCreationRequest request) {

        final Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        UUID user = UUID.fromString((String) authentication.getPrincipal());

        InternshipOffer internshipOffer = new InternshipOffer();

        internshipOffer.setUniqueId(UUID.randomUUID());
        internshipOffer.setEmployer(user);
        internshipOffer.setStatus(InternshipOffer.InternshipOfferStatus.PENDING_APPROVAL);
        internshipOffer.setCompany(request.getCompany());
        internshipOffer.setDuration(request.getDuration());
        internshipOffer.setHours(request.getHours());
        internshipOffer.setJobScope(request.getJobScope());
        internshipOffer.setJobTitle(request.getJobTitle());
        internshipOffer.setSalary(request.getSalary());
        internshipOffer.setStartDate(new Date(request.getStartDate()));

        internshipOfferRepository.save(internshipOffer);
    }

    /**
     *
     * @param request
     */
    public void validateInternshipOffer(@Valid InternshipOfferValidateRequest request){

        Optional<InternshipOffer> internshipOffer = internshipOfferRepository.findById(request.getUniqueId());

        internshipOffer.ifPresent(i -> {

            i.setStatus(request.isApproved()
                    ? InternshipOffer.InternshipOfferStatus.APPROVED
                    : InternshipOffer.InternshipOfferStatus.REJECTED);

            internshipOfferRepository.save(internshipOffer.get());
        });

    }

}
