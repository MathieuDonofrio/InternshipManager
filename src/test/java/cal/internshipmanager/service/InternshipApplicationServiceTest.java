package cal.internshipmanager.service;

import cal.internshipmanager.model.InternshipApplication;
import cal.internshipmanager.model.InternshipOffer;
import cal.internshipmanager.model.PortfolioDocument;
import cal.internshipmanager.model.User;
import cal.internshipmanager.repository.InternshipApplicationRepository;
import cal.internshipmanager.repository.InternshipOfferRepository;
import cal.internshipmanager.repository.PortfolioDocumentRepository;
import cal.internshipmanager.repository.UserRepository;
import cal.internshipmanager.request.InternshipApplicationCreationRequest;
import cal.internshipmanager.response.InternshipApplicationListResponse;
import cal.internshipmanager.security.JwtAuthentication;
import cal.internshipmanager.security.JwtProvider;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.*;
import java.util.stream.Collectors;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class InternshipApplicationServiceTest {

    @Autowired
    private JwtProvider jwtProvider;

    @Mock
    private InternshipApplicationRepository internshipApplicationRepository;

    @Mock
    private PortfolioDocumentRepository portfolioDocumentRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private InternshipOfferRepository internshipOfferRepository;

    @Test
    public void internshipApplications_validRequest() {

        // Arrange

        User user = new User();

        user.setUniqueId(UUID.randomUUID());

        InternshipOffer internshipOffer = new InternshipOffer();

        internshipOffer.setUniqueId(UUID.randomUUID());

        InternshipApplication internshipApplication = new InternshipApplication();

        internshipApplication.setUniqueId(UUID.randomUUID());
        internshipApplication.setStudentUniqueId(user.getUniqueId());
        internshipApplication.setOfferUniqueId(internshipOffer.getUniqueId());
        internshipApplication.setStatus(InternshipApplication.Status.APPROVED);
        internshipApplication.setDate(new Date());

        InternshipApplicationService internshipApplicationService = new InternshipApplicationService(
                internshipApplicationRepository, portfolioDocumentRepository, userRepository, internshipOfferRepository);

        Mockito.when(userRepository.findById(internshipApplication.getStudentUniqueId())).thenReturn(Optional.of(user));

        Mockito.when(internshipOfferRepository.findById(internshipApplication.getOfferUniqueId())).thenReturn(Optional.of(internshipOffer));

        Mockito.when(internshipApplicationRepository.findAllByStudentUniqueId(user.getUniqueId()))
                .thenReturn(List.of(internshipApplication));

        // Act

        InternshipApplicationListResponse response = internshipApplicationService.internshipApplications(user.getUniqueId());

        InternshipApplicationListResponse.InternshipApplication application = response.getApplications().get(0);

        // Assert

        assertEquals(internshipApplication.getUniqueId(), application.getUniqueId());
        assertEquals(internshipApplication.getStudentUniqueId(), application.getStudentUniqueId());
        assertEquals(internshipApplication.getOfferUniqueId(), application.getOfferUniqueId());
        assertEquals(internshipApplication.getDate().getTime(), application.getDate());
    }

    @Test
    public void create_validRequest() {

        // Arrange

        User user = new User();

        user.setUniqueId(UUID.randomUUID());
        user.setType("STUDENT");

        String token = jwtProvider.generate(user);
        DecodedJWT decodedToken = jwtProvider.verify(token);
        JwtAuthentication authentication = new JwtAuthentication(decodedToken);
        SecurityContextHolder.getContext().setAuthentication(authentication);

        InternshipApplicationService internshipApplicationService = new InternshipApplicationService(
                internshipApplicationRepository, portfolioDocumentRepository, userRepository, internshipOfferRepository);

        InternshipApplicationCreationRequest request = new InternshipApplicationCreationRequest();

        request.setOfferUniqueId(UUID.randomUUID());
        request.setDocuments(new ArrayList<>());

        UUID fakeDocumentUniqueId = UUID.randomUUID();

        request.getDocuments().add(fakeDocumentUniqueId);

        Mockito.when(portfolioDocumentRepository.findById(fakeDocumentUniqueId))
                .thenReturn(Optional.of(new PortfolioDocument()));

        // Act & Assert

        Mockito.when(internshipApplicationRepository.save(Mockito.any())).then(inv -> {

            InternshipApplication internshipApplication = (InternshipApplication) inv.getArgument(0);

            assertNotNull(internshipApplication.getUniqueId());
            assertEquals(request.getOfferUniqueId(), internshipApplication.getOfferUniqueId());
            assertEquals(user.getUniqueId(), internshipApplication.getStudentUniqueId());
            assertNotNull(internshipApplication.getDate());
            assertFalse(internshipApplication.getDocuments().isEmpty());

            return null;
        });

        internshipApplicationService.create(request);
    }

    @Test
    public void findByStatus_validRequest() {

        // Arrange

        User user = new User();

        user.setUniqueId(UUID.randomUUID());
        user.setFirstName("TestFirstName");
        user.setLastName("TestLastName");
        user.setType("STUDENT");

        InternshipOffer internshipOffer = new InternshipOffer();

        internshipOffer.setUniqueId(UUID.randomUUID());
        internshipOffer.setCompany("TestCompany");
        internshipOffer.setJobTitle("TestJobTitle");

        InternshipApplication internshipApplication = new InternshipApplication();

        internshipApplication.setUniqueId(UUID.randomUUID());
        internshipApplication.setStudentUniqueId(user.getUniqueId());
        internshipApplication.setOfferUniqueId(internshipOffer.getUniqueId());
        internshipApplication.setDate(new Date());
        internshipApplication.setStatus(InternshipApplication.Status.PENDING_APPROVAL);

        InternshipApplicationService internshipApplicationService = new InternshipApplicationService(
                internshipApplicationRepository, portfolioDocumentRepository, userRepository, internshipOfferRepository);

        Mockito.when(internshipApplicationRepository.findAllByStatus(Mockito.any())).thenReturn(List.of(internshipApplication));

        Mockito.when(userRepository.findById(internshipApplication.getStudentUniqueId())).thenReturn(Optional.of(user));

        Mockito.when(internshipOfferRepository.findById(internshipApplication.getOfferUniqueId())).thenReturn(Optional.of(internshipOffer));

        // Act

        InternshipApplicationListResponse response = internshipApplicationService.findByStatus(
                InternshipApplication.Status.PENDING_APPROVAL);

        // Assert

        assertEquals(1, response.getApplications().size());

        InternshipApplicationListResponse.InternshipApplication application = response.getApplications().get(0);

        assertEquals(internshipApplication.getUniqueId(), application.getUniqueId());
        assertEquals(internshipApplication.getStudentUniqueId(), application.getStudentUniqueId());
        assertEquals(user.getFirstName(), application.getStudentFirstName());
        assertEquals(user.getLastName(), application.getStudentLastName());
        assertEquals(internshipOffer.getCompany(), application.getCompany());
        assertEquals(internshipOffer.getJobTitle(), application.getJobTitle());
        assertEquals(internshipApplication.getDate().getTime(), application.getDate());
        assertEquals(InternshipApplication.Status.PENDING_APPROVAL.toString(), application.getStatus());
    }


    @Test
    public void findByOffer_validRequest() {
        // Arrange

        User user = new User();

        user.setUniqueId(UUID.randomUUID());
        user.setFirstName("TestFirstName");
        user.setLastName("TestLastName");
        user.setType("STUDENT");

        InternshipOffer internshipOffer = new InternshipOffer();

        internshipOffer.setUniqueId(UUID.randomUUID());
        internshipOffer.setCompany("TestCompany");
        internshipOffer.setJobTitle("TestJobTitle");

        InternshipApplication internshipApplication = new InternshipApplication();

        internshipApplication.setUniqueId(UUID.randomUUID());
        internshipApplication.setOfferUniqueId(internshipOffer.getUniqueId());
        internshipApplication.setStudentUniqueId(user.getUniqueId());
        internshipApplication.setDate(new Date());
        internshipApplication.setStatus(InternshipApplication.Status.APPROVED);

        InternshipApplicationListResponse response = new InternshipApplicationListResponse();


        InternshipApplicationService internshipApplicationService = new InternshipApplicationService(
                internshipApplicationRepository, portfolioDocumentRepository, userRepository, internshipOfferRepository);

        Mockito.when(internshipApplicationRepository.findAllByOfferUniqueIdAndStatus(Mockito.any(), Mockito.any())).thenReturn(List.of(internshipApplication));
        Mockito.when(userRepository.findById(internshipApplication.getStudentUniqueId())).thenReturn(Optional.of(user));
        Mockito.when(internshipOfferRepository.findById(internshipApplication.getOfferUniqueId())).thenReturn(Optional.of(internshipOffer));

        response.setApplications(List.of(internshipApplication).stream()
                .map(x -> InternshipApplicationListResponse.map(userRepository, internshipOfferRepository, x))
                .collect(Collectors.toList()));

        // Act
        InternshipApplicationListResponse responseToExpect = internshipApplicationService.findByOffer(internshipApplication.getOfferUniqueId());

        // Assert
        assertEquals(response,responseToExpect);
    }

    @Test
    public void approve_validRequest(){
        // Arrange

        InternshipOffer internshipOffer = new InternshipOffer();

        internshipOffer.setUniqueId(UUID.randomUUID());
        internshipOffer.setCompany("TestCompany");
        internshipOffer.setJobTitle("TestJobTitle");

        InternshipApplication internshipApplication = new InternshipApplication();

        internshipApplication.setUniqueId(UUID.randomUUID());
        internshipApplication.setOfferUniqueId(internshipOffer.getUniqueId());
        internshipApplication.setDate(new Date());
        internshipApplication.setStatus(InternshipApplication.Status.PENDING_APPROVAL);

        InternshipApplicationService internshipApplicationService = new InternshipApplicationService(
                internshipApplicationRepository, portfolioDocumentRepository, userRepository, internshipOfferRepository);

        Mockito.when(internshipApplicationRepository.findById(Mockito.any())).thenReturn(Optional.of(internshipApplication));

        // Act & Assert

        Mockito.when(internshipApplicationRepository.save(Mockito.any())).then(inv -> {
            InternshipApplication application = (InternshipApplication) inv.getArgument(0);

            assertEquals(InternshipApplication.Status.APPROVED,application.getStatus());

            return null;
        });

        internshipApplicationService.approve(internshipApplication.getUniqueId());

    }

    @Test
    public void reject_validRequest(){

        // Arrange

        InternshipOffer internshipOffer = new InternshipOffer();

        internshipOffer.setUniqueId(UUID.randomUUID());
        internshipOffer.setCompany("TestCompany");
        internshipOffer.setJobTitle("TestJobTitle");

        InternshipApplication internshipApplication = new InternshipApplication();

        internshipApplication.setUniqueId(UUID.randomUUID());
        internshipApplication.setOfferUniqueId(internshipOffer.getUniqueId());
        internshipApplication.setDate(new Date());
        internshipApplication.setStatus(InternshipApplication.Status.PENDING_APPROVAL);

        InternshipApplicationService internshipApplicationService = new InternshipApplicationService(
                internshipApplicationRepository, portfolioDocumentRepository, userRepository, internshipOfferRepository);

        Mockito.when(internshipApplicationRepository.findById(Mockito.any())).thenReturn(Optional.of(internshipApplication));

        // Act & Assert

        Mockito.when(internshipApplicationRepository.save(Mockito.any())).then(inv -> {
            InternshipApplication application = (InternshipApplication) inv.getArgument(0);

            assertEquals(InternshipApplication.Status.REJECTED,application.getStatus());

            return null;
        });

        internshipApplicationService.reject(internshipApplication.getUniqueId());

    }

    @Test
    public void select_validRequest(){

        // Arrange

        InternshipOffer internshipOffer = new InternshipOffer();

        internshipOffer.setUniqueId(UUID.randomUUID());
        internshipOffer.setCompany("TestCompany");
        internshipOffer.setJobTitle("TestJobTitle");

        InternshipApplication internshipApplication = new InternshipApplication();

        internshipApplication.setUniqueId(UUID.randomUUID());
        internshipApplication.setOfferUniqueId(internshipOffer.getUniqueId());
        internshipApplication.setDate(new Date());
        internshipApplication.setStatus(InternshipApplication.Status.SELECTED);

        InternshipApplicationService internshipApplicationService = new InternshipApplicationService(
                internshipApplicationRepository, portfolioDocumentRepository, userRepository, internshipOfferRepository);

        Mockito.when(internshipApplicationRepository.findById(Mockito.any())).thenReturn(Optional.of(internshipApplication));

        // Act & Assert

        Mockito.when(internshipApplicationRepository.save(Mockito.any())).then(inv -> {
            InternshipApplication application = (InternshipApplication) inv.getArgument(0);

            assertEquals(InternshipApplication.Status.SELECTED,application.getStatus());

            return null;
        });

        internshipApplicationService.select(internshipApplication.getUniqueId());

    }
}
