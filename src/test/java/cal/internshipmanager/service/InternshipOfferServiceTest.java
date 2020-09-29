package cal.internshipmanager.service;

import cal.internshipmanager.model.InternshipOffer;
import cal.internshipmanager.model.User;
import cal.internshipmanager.repository.InternshipOfferRepository;
import cal.internshipmanager.request.InternshipOfferCreationRequest;
import cal.internshipmanager.request.InternshipOfferApproveRequest;
import cal.internshipmanager.request.InternshipOfferRejectRequest;
import cal.internshipmanager.response.InternshipOfferListResponse;
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
            assertEquals(internshipOfferCreationRequest.getStartDate(),internshipOffer.getStartDate().getTime());

            return null;
        });

        internshipOfferService.createInternshipOffer(internshipOfferCreationRequest);
    }

    @Test
    public void approveInternshipOffer_validRequest(){

        // Arrange

        InternshipOfferApproveRequest internshipOfferApproveRequest = new InternshipOfferApproveRequest();

        internshipOfferApproveRequest.setUniqueId(UUID.randomUUID());

        InternshipOffer internshipOffer = new InternshipOffer();

        internshipOffer.setStatus(InternshipOffer.Status.PENDING_APPROVAL);

        InternshipOfferService internshipOfferService = new InternshipOfferService(internshipOfferRepository);

        Mockito.when(internshipOfferRepository.findById(Mockito.any())).thenReturn(Optional.of(internshipOffer));

        // Act & Assert

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

        Mockito.when(internshipOfferRepository.findById(Mockito.any())).thenReturn(Optional.of(internshipOffer));

        // Act & Assert

        Mockito.when(internshipOfferRepository.save(Mockito.any())).then(inv ->{

            InternshipOffer offer = (InternshipOffer) inv.getArgument(0);

            assertEquals(InternshipOffer.Status.REJECTED, offer.getStatus());

            return null;
        });

        internshipOfferService.rejectInternshipOffer(internshipOfferRejectRequest);
    }

    @Test
    public void pendingApprovalInternshipOffers_validRequest(){

        // Arrange

        InternshipOffer internshipOffer = new InternshipOffer();

        internshipOffer.setUniqueId(UUID.randomUUID());
        internshipOffer.setEmployer(UUID.randomUUID());
        internshipOffer.setStatus(InternshipOffer.Status.PENDING_APPROVAL);
        internshipOffer.setCompany("Test Company");
        internshipOffer.setJobTitle("Test Job Title");
        internshipOffer.setStartDate(new Date());
        internshipOffer.setDuration(12);
        internshipOffer.setSalary(20);
        internshipOffer.setHours(40);

        InternshipOfferService internshipOfferService = new InternshipOfferService(internshipOfferRepository);

        Mockito.when(internshipOfferRepository.findAllByStatus(InternshipOffer.Status.PENDING_APPROVAL))
                .thenReturn(List.of(internshipOffer));

        // Act

        InternshipOfferListResponse response = internshipOfferService.pendingApprovalInternshipOffers();

        // Assert

        assertEquals(1, response.getInternshipOffers().size());

        for(InternshipOfferListResponse.InternshipOffer offer : response.getInternshipOffers()){

            assertEquals(internshipOffer.getUniqueId(), offer.getUniqueId());
            assertEquals(internshipOffer.getEmployer(), offer.getEmployer());
            assertEquals(InternshipOffer.Status.PENDING_APPROVAL.toString(), offer.getStatus());
            assertEquals(internshipOffer.getCompany(), offer.getCompany());
            assertEquals(internshipOffer.getJobTitle(), offer.getJobTitle());
            assertEquals(internshipOffer.getStartDate().getTime(), offer.getStartDate());
            assertEquals(internshipOffer.getDuration(), offer.getDuration());
            assertEquals(internshipOffer.getSalary(), offer.getSalary());
            assertEquals(internshipOffer.getHours(), offer.getHours());

        }

    }

    @Test
    public void approvedInternshipOffers_validRequest(){

        // Arrange

        InternshipOffer internshipOffer = new InternshipOffer();

        internshipOffer.setUniqueId(UUID.randomUUID());
        internshipOffer.setEmployer(UUID.randomUUID());
        internshipOffer.setStatus(InternshipOffer.Status.APPROVED);
        internshipOffer.setCompany("Test Company");
        internshipOffer.setJobTitle("Test Job Title");
        internshipOffer.setStartDate(new Date());
        internshipOffer.setDuration(12);
        internshipOffer.setSalary(20);
        internshipOffer.setHours(40);

        InternshipOfferService internshipOfferService = new InternshipOfferService(internshipOfferRepository);

        Mockito.when(internshipOfferRepository.findAllByStatus(InternshipOffer.Status.APPROVED))
                .thenReturn(List.of(internshipOffer));

        // Act

        InternshipOfferListResponse response = internshipOfferService.approvedInternshipOffers();

        // Assert

        assertEquals(1, response.getInternshipOffers().size());

        for(InternshipOfferListResponse.InternshipOffer offer : response.getInternshipOffers()){

            assertEquals(internshipOffer.getUniqueId(), offer.getUniqueId());
            assertEquals(internshipOffer.getEmployer(), offer.getEmployer());
            assertEquals(InternshipOffer.Status.APPROVED.toString(), offer.getStatus());
            assertEquals(internshipOffer.getCompany(), offer.getCompany());
            assertEquals(internshipOffer.getJobTitle(), offer.getJobTitle());
            assertEquals(internshipOffer.getStartDate().getTime(), offer.getStartDate());
            assertEquals(internshipOffer.getDuration(), offer.getDuration());
            assertEquals(internshipOffer.getSalary(), offer.getSalary());
            assertEquals(internshipOffer.getHours(), offer.getHours());

        }

    }

    @Test
    public void rejectedInternshipOffers_validRequest(){

        // Arrange

        InternshipOffer internshipOffer = new InternshipOffer();

        internshipOffer.setUniqueId(UUID.randomUUID());
        internshipOffer.setEmployer(UUID.randomUUID());
        internshipOffer.setStatus(InternshipOffer.Status.REJECTED);
        internshipOffer.setCompany("Test Company");
        internshipOffer.setJobTitle("Test Job Title");
        internshipOffer.setStartDate(new Date());
        internshipOffer.setDuration(12);
        internshipOffer.setSalary(20);
        internshipOffer.setHours(40);

        InternshipOfferService internshipOfferService = new InternshipOfferService(internshipOfferRepository);

        Mockito.when(internshipOfferRepository.findAllByStatus(InternshipOffer.Status.REJECTED))
                .thenReturn(List.of(internshipOffer));

        // Act

        InternshipOfferListResponse response = internshipOfferService.rejectedInternshipOffers();

        // Assert

        assertEquals(1, response.getInternshipOffers().size());

        for(InternshipOfferListResponse.InternshipOffer offer : response.getInternshipOffers()){

            assertEquals(internshipOffer.getUniqueId(), offer.getUniqueId());
            assertEquals(internshipOffer.getEmployer(), offer.getEmployer());
            assertEquals(InternshipOffer.Status.REJECTED.toString(), offer.getStatus());
            assertEquals(internshipOffer.getCompany(), offer.getCompany());
            assertEquals(internshipOffer.getJobTitle(), offer.getJobTitle());
            assertEquals(internshipOffer.getStartDate().getTime(), offer.getStartDate());
            assertEquals(internshipOffer.getDuration(), offer.getDuration());
            assertEquals(internshipOffer.getSalary(), offer.getSalary());
            assertEquals(internshipOffer.getHours(), offer.getHours());

        }

    }

}
