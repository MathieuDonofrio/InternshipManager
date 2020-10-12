package cal.internshipmanager.service;

import cal.internshipmanager.model.InternshipApplication;
import cal.internshipmanager.model.PortfolioDocument;
import cal.internshipmanager.model.User;
import cal.internshipmanager.repository.InternshipApplicationRepository;
import cal.internshipmanager.repository.PortfolioDocumentRepository;
import cal.internshipmanager.request.InternshipApplicationCreationRequest;
import cal.internshipmanager.request.InternshipApplicationEditRequest;
import cal.internshipmanager.request.InternshipApplicationFindByStatusRequest;
import cal.internshipmanager.response.InternshipApplicationListResponse;
import cal.internshipmanager.response.PortfolioDocumentListResponse;
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

    @Test
    public void internshipApplications_validRequest() {

        // Arrange

        UUID userUniqueId = UUID.randomUUID();

        InternshipApplication internshipApplication = new InternshipApplication();

        internshipApplication.setUniqueId(UUID.randomUUID());
        internshipApplication.setStudentUniqueId(userUniqueId);
        internshipApplication.setOfferUniqueId(UUID.randomUUID());
        internshipApplication.setStatus(InternshipApplication.Status.APPROVED);
        internshipApplication.setDate(new Date());

        InternshipApplicationService internshipApplicationService = new InternshipApplicationService(internshipApplicationRepository,null);

        Mockito.when(internshipApplicationRepository.findAllByStudentUniqueId(userUniqueId))
                .thenReturn(List.of(internshipApplication));

        // Act

        InternshipApplicationListResponse response = internshipApplicationService.internshipApplications(userUniqueId);

        InternshipApplicationListResponse.InternshipApplication application = response.getApplications().get(0);

        // Assert

        assertEquals(internshipApplication.getUniqueId(), application.getUniqueId());
        assertEquals(internshipApplication.getStudentUniqueId(), application.getStudentUniqueId());
        assertEquals(internshipApplication.getOfferUniqueId(), application.getOfferUniqueId());
        assertEquals(internshipApplication.getDate().getTime(), application.getDate());
    }

    @Test
    public void createInternshipOffer_validRequest(){

        // Arrange

        User user = new User();

        user.setUniqueId(UUID.randomUUID());
        user.setType("STUDENT");

        String token = jwtProvider.generate(user);
        DecodedJWT decodedToken = jwtProvider.verify(token);
        JwtAuthentication authentication = new JwtAuthentication(decodedToken);
        SecurityContextHolder.getContext().setAuthentication(authentication);

        InternshipApplicationService internshipApplicationService = new InternshipApplicationService(
                internshipApplicationRepository, portfolioDocumentRepository);

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
    public void findInternshipByStatus_validRequest(){
        //ARRANGE

        InternshipApplicationService internshipApplicationService = new InternshipApplicationService(
                internshipApplicationRepository, portfolioDocumentRepository);

        List<InternshipApplication> internshipApplications = new ArrayList<>();
        InternshipApplication internshipApplication = new InternshipApplication();

        for (int i = 0; i < 10; i++) {
            internshipApplication.setUniqueId(UUID.randomUUID());
            internshipApplication.setStatus(InternshipApplication.Status.APPROVED);
            internshipApplication.setDate(new Date());
            internshipApplications.add(internshipApplication);
        }

        InternshipApplicationListResponse responseExpected = new InternshipApplicationListResponse();

        responseExpected.setApplications(internshipApplications.stream()
                .map(x -> InternshipApplicationListResponse.map(x)).collect(Collectors.toList()));

        InternshipApplicationFindByStatusRequest request = new InternshipApplicationFindByStatusRequest();
        request.setStatus(InternshipApplication.Status.APPROVED);

        //ACT
        Mockito.when(internshipApplicationRepository.findAllByStatus(Mockito.any())).thenReturn(internshipApplications);
        InternshipApplicationListResponse responseActual = internshipApplicationService.findByStatus(request);

        //ASSERT
        assertEquals(responseExpected,responseActual);

    }

    @Test
    public void editInternshipStatus_validRequest(){
        //ARRANGE
        InternshipApplicationService internshipApplicationService = new InternshipApplicationService(
                internshipApplicationRepository, portfolioDocumentRepository);

        InternshipApplication internshipApplicationToEdit = new InternshipApplication();
        internshipApplicationToEdit.setUniqueId(UUID.randomUUID());
        internshipApplicationToEdit.setStatus(InternshipApplication.Status.APPROVED);
        internshipApplicationToEdit.setDate(new Date());

        InternshipApplicationEditRequest request = new InternshipApplicationEditRequest();
        request.setApplicationId(internshipApplicationToEdit.getUniqueId());
        request.setStatus(internshipApplicationToEdit.getStatus());

        //ACT & ASSERT

        Mockito.when(internshipApplicationRepository.save(Mockito.any())).then(inv -> {

            InternshipApplication internshipApplication = (InternshipApplication) inv.getArgument(0);

            assertNotNull(internshipApplication.getUniqueId());
            assertEquals(internshipApplication.getOfferUniqueId(), internshipApplicationToEdit.getOfferUniqueId());
            assertNotNull(internshipApplication.getDate());
            assertTrue(internshipApplication.getDocuments().isEmpty());

            return null;
        });

        internshipApplicationService.editStatus(request);
    }
}
