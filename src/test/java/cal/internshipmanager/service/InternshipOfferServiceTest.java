package cal.internshipmanager.service;

import cal.internshipmanager.model.InternshipOffer;
import cal.internshipmanager.model.User;
import cal.internshipmanager.repository.InternshipOfferRepository;
import cal.internshipmanager.request.InternshipOfferCreationRequest;
import cal.internshipmanager.request.InternshipOfferValidateRequest;
import cal.internshipmanager.security.JwtAuthentication;
import cal.internshipmanager.security.JwtProvider;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Arrays;
import java.util.Date;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
public class InternshipOfferServiceTest {

    @Autowired
    private JwtProvider jwtProvider;

    @Mock
    private InternshipOfferRepository internshipOfferRepository;

    @Test
    public void createInternshipOffer_validRequest(){

        // Arrange

        User user = new User();

        user.setUniqueId(UUID.randomUUID());
        user.setType("EMPLOYER");

        String token = jwtProvider.generate(user);
        DecodedJWT decodedToken = jwtProvider.verify(token);
        JwtAuthentication authentication = new JwtAuthentication(decodedToken);
        SecurityContextHolder.getContext().setAuthentication(authentication);

        InternshipOfferService internshipOfferService = new InternshipOfferService(internshipOfferRepository);

        InternshipOfferCreationRequest internshipOfferCreationRequest = new InternshipOfferCreationRequest();

        internshipOfferCreationRequest.setCompany("test");
        internshipOfferCreationRequest.setDuration(25);
        internshipOfferCreationRequest.setHours(20);
        internshipOfferCreationRequest.setJobScope(Arrays.asList("test","test","test","test"));
        internshipOfferCreationRequest.setJobTitle("test");
        internshipOfferCreationRequest.setSalary(69.25f);
        internshipOfferCreationRequest.setStartDate(new Date().getTime());

        // Act & Assert

        Mockito.when(internshipOfferRepository.save(Mockito.any())).then(inv -> {

            InternshipOffer internshipOffer = (InternshipOffer) inv.getArgument(0);

            assertNotNull(internshipOffer.getUniqueId());
            assertEquals(user.getUniqueId(), internshipOffer.getEmployer());
            assertEquals(InternshipOffer.InternshipOfferStatus.PENDING_APPROVAL, internshipOffer.getStatus());
            assertEquals(internshipOfferCreationRequest.getCompany(),internshipOffer.getCompany());
            assertEquals(internshipOfferCreationRequest.getDuration(),internshipOffer.getDuration());
            assertEquals(internshipOfferCreationRequest.getHours(),internshipOffer.getHours());
            assertEquals(internshipOfferCreationRequest.getJobScope(),internshipOffer.getJobScope());
            assertEquals(internshipOfferCreationRequest.getJobTitle(),internshipOffer.getJobTitle());
            assertEquals(internshipOfferCreationRequest.getSalary(),internshipOffer.getSalary());
            assertEquals(internshipOfferCreationRequest.getStartDate(),internshipOffer.getStartDate());

            return null;
        });
    }

    @Test
    public void validateInternshipOffer_approve(){

        // Arrange

        InternshipOfferValidateRequest internshipOfferStatusRequest = new InternshipOfferValidateRequest();

        internshipOfferStatusRequest.setUniqueId(UUID.randomUUID());
        internshipOfferStatusRequest.setApproved(true);

        InternshipOffer internshipOffer = new InternshipOffer();
        internshipOffer.setStatus(InternshipOffer.InternshipOfferStatus.PENDING_APPROVAL);

        InternshipOfferService internshipOfferService = new InternshipOfferService(internshipOfferRepository);

        // Act & Assert

        Mockito.when(internshipOfferRepository.findById(Mockito.any())).thenReturn(Optional.of(internshipOffer));

        Mockito.when(internshipOfferRepository.save(Mockito.any())).then(inv ->{

                InternshipOffer offer = (InternshipOffer) inv.getArgument(0);

                assertEquals(InternshipOffer.InternshipOfferStatus.APPROVED, offer.getStatus());

                return null;
        });

        internshipOfferService.validateInternshipOffer(internshipOfferStatusRequest);
    }

    @Test
    public void validateInternshipOffer_reject(){

        // Arrange

        InternshipOfferValidateRequest internshipOfferStatusRequest = new InternshipOfferValidateRequest();

        internshipOfferStatusRequest.setUniqueId(UUID.randomUUID());
        internshipOfferStatusRequest.setApproved(false);

        InternshipOffer internshipOffer = new InternshipOffer();
        internshipOffer.setStatus(InternshipOffer.InternshipOfferStatus.PENDING_APPROVAL);

        InternshipOfferService internshipOfferService = new InternshipOfferService(internshipOfferRepository);

        // Act & Assert

        Mockito.when(internshipOfferRepository.findById(Mockito.any())).thenReturn(Optional.of(internshipOffer));

        Mockito.when(internshipOfferRepository.save(Mockito.any())).then(inv ->{

            InternshipOffer offer = (InternshipOffer) inv.getArgument(0);

            assertEquals(InternshipOffer.InternshipOfferStatus.REJECTED, offer.getStatus());

            return null;
        });

        internshipOfferService.validateInternshipOffer(internshipOfferStatusRequest);
    }
}
