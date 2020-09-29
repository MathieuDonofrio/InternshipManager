package cal.internshipmanager.service;

import cal.internshipmanager.model.InternshipOffer;
import cal.internshipmanager.model.User;
import cal.internshipmanager.repository.InternshipOfferRepository;
import cal.internshipmanager.request.InternshipOfferCreationRequest;
import cal.internshipmanager.request.InternshipOfferApproveRequest;
import cal.internshipmanager.request.InternshipOfferRejectRequest;
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
            assertEquals(InternshipOffer.Status.PENDING_APPROVAL, internshipOffer.getStatus());
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
    public void approveInternshipOffer_validRequest(){

        // Arrange

        InternshipOfferApproveRequest internshipOfferApproveRequest = new InternshipOfferApproveRequest();

        internshipOfferApproveRequest.setUniqueId(UUID.randomUUID());

        InternshipOffer internshipOffer = new InternshipOffer();
        internshipOffer.setStatus(InternshipOffer.Status.PENDING_APPROVAL);

        InternshipOfferService internshipOfferService = new InternshipOfferService(internshipOfferRepository);

        // Act & Assert

        Mockito.when(internshipOfferRepository.findById(Mockito.any())).thenReturn(Optional.of(internshipOffer));

        Mockito.when(internshipOfferRepository.save(Mockito.any())).then(inv ->{

                InternshipOffer offer = (InternshipOffer) inv.getArgument(0);

                assertEquals(InternshipOffer.Status.APPROVED, offer.getStatus());

                return null;
        });

        internshipOfferService.approveInternshipOffer(internshipOfferApproveRequest);
    }

    @Test
    public void rejectInternshipOffer_validRequest(){

        // Arrange

        InternshipOfferRejectRequest internshipOfferRejectRequest = new InternshipOfferRejectRequest();

        internshipOfferRejectRequest.setUniqueId(UUID.randomUUID());

        InternshipOffer internshipOffer = new InternshipOffer();
        internshipOffer.setStatus(InternshipOffer.Status.PENDING_APPROVAL);

        InternshipOfferService internshipOfferService = new InternshipOfferService(internshipOfferRepository);

        // Act & Assert

        Mockito.when(internshipOfferRepository.findById(Mockito.any())).thenReturn(Optional.of(internshipOffer));

        Mockito.when(internshipOfferRepository.save(Mockito.any())).then(inv ->{

            InternshipOffer offer = (InternshipOffer) inv.getArgument(0);

            assertEquals(InternshipOffer.Status.REJECTED, offer.getStatus());

            return null;
        });

        internshipOfferService.rejectInternshipOffer(internshipOfferRejectRequest);
    }

}
