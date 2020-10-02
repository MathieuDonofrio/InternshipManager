package cal.internshipmanager.service;

import cal.internshipmanager.model.InternshipApplication;
import cal.internshipmanager.model.User;
import cal.internshipmanager.repository.InternshipApplicationRepository;
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

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
public class InternshipApplicationRepositoryServiceTest {

    @Autowired
    private JwtProvider jwtProvider;

    @Mock
    private InternshipApplicationRepository internshipApplicationRepository;

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

        ApplicationOfferService applicationOfferService = new ApplicationOfferService(internshipApplicationRepository);

        InternshipApplicationCreationRequest internshipApplicationCreationRequest = new InternshipApplicationCreationRequest();

        internshipApplicationCreationRequest.setOfferUniqueId(UUID.randomUUID());

        // Act & Assert

        Mockito.when(internshipApplicationRepository.save(Mockito.any())).then(inv -> {

            InternshipApplication internshipApplication = (InternshipApplication) inv.getArgument(0);

            assertNotNull(internshipApplication.getUniqueId());
            assertEquals(internshipApplicationCreationRequest.getOfferUniqueId(), internshipApplication.getOfferUniqueId());
            assertEquals(user.getUniqueId(), internshipApplication.getStudentUniqueId());
            assertNotNull(internshipApplication.getDate());
            return null;
        });
    }
}
