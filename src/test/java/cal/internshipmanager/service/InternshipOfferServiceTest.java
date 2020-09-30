package cal.internshipmanager.service;

import cal.internshipmanager.model.InternshipOffer;
import cal.internshipmanager.model.User;
import cal.internshipmanager.repository.InternshipOfferRepository;
import cal.internshipmanager.repository.UserRepository;
import cal.internshipmanager.request.*;
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

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class InternshipOfferServiceTest {

    @Autowired
    private JwtProvider jwtProvider;

    @Mock
    private InternshipOfferRepository internshipOfferRepository;

    @Mock
    private UserRepository userRepository;

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

        InternshipOfferService internshipOfferService = new InternshipOfferService(internshipOfferRepository, null);

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

        InternshipOfferService internshipOfferService = new InternshipOfferService(internshipOfferRepository, null);

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

        InternshipOfferService internshipOfferService = new InternshipOfferService(internshipOfferRepository, null);

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

        InternshipOfferService internshipOfferService = new InternshipOfferService(internshipOfferRepository, null);

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

        InternshipOfferService internshipOfferService = new InternshipOfferService(internshipOfferRepository, null);

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

        InternshipOfferService internshipOfferService = new InternshipOfferService(internshipOfferRepository, null);

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

    @Test
    public void addUserToInternshipOffer_validRequest(){

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
        internshipOffer.setVisibility(new ArrayList<>());

        User user = new User();

        user.setUniqueId(UUID.randomUUID());
        user.setType("STUDENT");
        user.setEmail("toto@gmail.com");
        user.setFirstName("Toto");
        user.setLastName("Tata");

        InternshipOfferService internshipOfferService = new InternshipOfferService(internshipOfferRepository, userRepository);

        InternshipOfferAddUserRequest request = new InternshipOfferAddUserRequest();

        request.setOfferUniqueId(internshipOffer.getUniqueId());
        request.setUserUniqueId(user.getUniqueId());

        Mockito.when(internshipOfferRepository.findById(internshipOffer.getUniqueId()))
                .thenReturn(Optional.of(internshipOffer));

        Mockito.when(userRepository.findById(internshipOffer.getUniqueId()))
                .thenReturn(Optional.of(user));


        // Act & Assert

        internshipOfferService.addUserToInternshipOffer(request);

        Mockito.when(internshipOfferRepository.save(Mockito.any())).then(inv ->{

            InternshipOffer offer = (InternshipOffer) inv.getArgument(0);

            User user1 = offer.getVisibility().get(0);

            assertEquals(user.getUniqueId(), user1.getUniqueId());

            return null;
        });

    }

    @Test
    public void removeUserToInternshipOffer_validRequest(){

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
        internshipOffer.setVisibility(new ArrayList<>());

        User user = new User();

        user.setUniqueId(UUID.randomUUID());
        user.setType("STUDENT");
        user.setEmail("toto@gmail.com");
        user.setFirstName("Toto");
        user.setLastName("Tata");

        internshipOffer.getVisibility().add(user);

        InternshipOfferService internshipOfferService = new InternshipOfferService(internshipOfferRepository, userRepository);

        InternshipOfferRemoveUserRequest request = new InternshipOfferRemoveUserRequest();

        request.setOfferUniqueId(internshipOffer.getUniqueId());
        request.setUserUniqueId(user.getUniqueId());

        Mockito.when(internshipOfferRepository.findById(internshipOffer.getUniqueId()))
                .thenReturn(Optional.of(internshipOffer));

        Mockito.when(userRepository.findById(internshipOffer.getUniqueId()))
                .thenReturn(Optional.of(user));


        // Act & Assert

        internshipOfferService.removeUserToInternshipOffer(request);

        Mockito.when(internshipOfferRepository.save(Mockito.any())).then(inv ->{

            InternshipOffer offer = (InternshipOffer) inv.getArgument(0);

            assertTrue(offer.getVisibility().isEmpty());

            return null;
        });

    }

}
