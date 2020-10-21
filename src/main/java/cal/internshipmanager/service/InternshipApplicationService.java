package cal.internshipmanager.service;

import cal.internshipmanager.model.InternshipApplication;
import cal.internshipmanager.model.PortfolioDocument;
import cal.internshipmanager.repository.InternshipApplicationRepository;
import cal.internshipmanager.repository.InternshipOfferRepository;
import cal.internshipmanager.repository.PortfolioDocumentRepository;
import cal.internshipmanager.repository.UserRepository;
import cal.internshipmanager.request.InternshipApplicationCreationRequest;
import cal.internshipmanager.response.InternshipApplicationListResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Validated
public class InternshipApplicationService {

    //
    // Dependencies
    //

    private final InternshipApplicationRepository internshipApplicationRepository;

    private final PortfolioDocumentRepository portfolioDocumentRepository;

    private final UserRepository userRepository;

    private final InternshipOfferRepository internshipOfferRepository;

    //
    // Constructors
    //

    public InternshipApplicationService(InternshipApplicationRepository internshipApplicationRepository,
                                        PortfolioDocumentRepository portfolioDocumentRepository,
                                        UserRepository userRepository,
                                        InternshipOfferRepository internshipOfferRepository) {
        this.internshipApplicationRepository = internshipApplicationRepository;
        this.portfolioDocumentRepository = portfolioDocumentRepository;
        this.userRepository = userRepository;
        this.internshipOfferRepository = internshipOfferRepository;
    }

    //
    // Services
    //

    public void create(@Valid InternshipApplicationCreationRequest request) {

        final Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        UUID userUniqueId = UUID.fromString((String) authentication.getPrincipal());

        List<PortfolioDocument> documents = new ArrayList<>();

        for (UUID portfolioDocumentUniqueId : request.getDocuments())
            portfolioDocumentRepository.findById(portfolioDocumentUniqueId)
                    .ifPresent(x -> documents.add(x));

        InternshipApplication internshipApplication = new InternshipApplication();

        internshipApplication.setUniqueId(UUID.randomUUID());
        internshipApplication.setStudentUniqueId(userUniqueId);
        internshipApplication.setOfferUniqueId(request.getOfferUniqueId());
        internshipApplication.setDate(new Date());
        internshipApplication.setDocuments(documents);
        internshipApplication.setStatus(InternshipApplication.Status.PENDING_APPROVAL);

        internshipApplicationRepository.save(internshipApplication);
    }

    public InternshipApplicationListResponse internshipApplications(@NotNull UUID userUniqueId) {

        List<InternshipApplication> userApplications = internshipApplicationRepository.findAllByStudentUniqueId(userUniqueId);

        InternshipApplicationListResponse response = new InternshipApplicationListResponse();

        response.setApplications(userApplications.stream()
                .map(x -> InternshipApplicationListResponse.map(userRepository, internshipOfferRepository, x))
                .collect(Collectors.toList()));

        return response;
    }

    public InternshipApplicationListResponse findByStatus(@Valid InternshipApplication.Status status) {

        List<InternshipApplication> allApplications = internshipApplicationRepository.findAllByStatus(status);

        InternshipApplicationListResponse response = new InternshipApplicationListResponse();

        response.setApplications(allApplications.stream()
                .map(x -> InternshipApplicationListResponse.map(userRepository, internshipOfferRepository, x))
                .collect(Collectors.toList()));

        return response;
    }

    public void approve(@NotNull UUID uniqueId){

        InternshipApplication application = internshipApplicationRepository.findById(uniqueId).orElse(null);

        application.setStatus(InternshipApplication.Status.APPROVED);

        internshipApplicationRepository.save(application);
    }

    public void reject(@NotNull UUID uniqueId){

        InternshipApplication application = internshipApplicationRepository.findById(uniqueId).orElse(null);

        application.setStatus(InternshipApplication.Status.REJECTED);

        internshipApplicationRepository.save(application);
    }

    public void select(@NotNull UUID uniqueId){
        InternshipApplication application = internshipApplicationRepository.findById(uniqueId).orElse(null);

        application.setStatus(InternshipApplication.Status.SELECTED);

        internshipApplicationRepository.save(application);
    }


    public InternshipApplicationListResponse findByOffer(@NotNull UUID uniqueId) {

        List<InternshipApplication> allApplications = internshipApplicationRepository.findAllByOfferUniqueIdAndStatus(uniqueId, InternshipApplication.Status.APPROVED);

        InternshipApplicationListResponse response = new InternshipApplicationListResponse();

        response.setApplications(allApplications.stream()
                .map(x -> InternshipApplicationListResponse.map(userRepository, internshipOfferRepository, x))
                .collect(Collectors.toList()));

        return response;
    }


}
