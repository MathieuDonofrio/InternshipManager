package cal.internshipmanager.service;

import cal.internshipmanager.model.InternshipApplication;
import cal.internshipmanager.model.PortfolioDocument;
import cal.internshipmanager.model.User;
import cal.internshipmanager.repository.InternshipApplicationRepository;
import cal.internshipmanager.repository.PortfolioDocumentRepository;
import cal.internshipmanager.request.InternshipApplicationCreationRequest;
import cal.internshipmanager.security.JwtAuthentication;
import cal.internshipmanager.security.JwtProvider;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.ArrayList;
import java.util.Optional;
import java.util.UUID;

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

        internshipApplicationService.createApplicationOffer(request);
    }
}
