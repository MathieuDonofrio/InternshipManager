package cal.internshipmanager.service;

import cal.internshipmanager.model.Contract;
import cal.internshipmanager.model.InternshipApplication;
import cal.internshipmanager.model.InternshipOffer;
import cal.internshipmanager.model.User;
import cal.internshipmanager.repository.ContractRepository;
import cal.internshipmanager.repository.InternshipApplicationRepository;
import cal.internshipmanager.repository.UserRepository;
import cal.internshipmanager.response.ContractListResponse;
import cal.internshipmanager.response.PortfolioDocumentListResponse;
import cal.internshipmanager.security.JwtAuthentication;
import cal.internshipmanager.security.JwtProvider;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@SpringBootTest
public class ContractServiceTest {

    @Mock
    private ContractRepository contractRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private InternshipApplicationRepository internshipApplicationRepository;

    @Mock
    SettingsService settingsService;

    @Autowired
    private JwtProvider jwtProvider;

    @Test
    public void create_validRequest(){

        // Arrange

        User user = new User();

        user.setUniqueId(UUID.randomUUID());
        user.setType(User.Type.ADMINISTRATOR);
        user.setEmail("admin@admin.com");
        user.setFirstName("Admin");
        user.setLastName("Admin");

        String token = jwtProvider.generate(user);
        DecodedJWT decodedToken = jwtProvider.verify(token);
        JwtAuthentication authentication = new JwtAuthentication(decodedToken);
        SecurityContextHolder.getContext().setAuthentication(authentication);

        User student = new User();
        student.setUniqueId(UUID.randomUUID());
        student.setType(User.Type.STUDENT);
        student.setEmail("student@student.com");
        student.setFirstName("student");
        student.setLastName("student");


        User employer = new User();
        employer.setUniqueId(UUID.randomUUID());
        employer.setType(User.Type.EMPLOYER);
        employer.setEmail("employer@employer.com");
        employer.setFirstName("employer");
        employer.setLastName("employer");



        InternshipOffer internshipOffer = new InternshipOffer();
        internshipOffer.setUniqueId(UUID.randomUUID());
        internshipOffer.setEmployer(employer.getUniqueId());



        InternshipApplication application = new InternshipApplication();

        application.setUniqueId(UUID.randomUUID());
        application.setSemester(settingsService.getSemester());
        application.setStudent(student);
        application.setOffer(internshipOffer);
        application.setStatus(InternshipApplication.Status.APPROVED);
        application.setDate(new Date());
        application.setInterviewDate(new Date());


        ContractService contractService = new ContractService(internshipApplicationRepository, userRepository, null, contractRepository, settingsService );

        when (userRepository.findById(user.getUniqueId())).thenReturn(Optional.of(user));
        when (internshipApplicationRepository.findById(application.getUniqueId())).thenReturn(Optional.of(application));

        when(contractRepository.save(any())).then(inv -> {

            Contract contract = inv.getArgument(0);

           assertNotNull(contract.getUniqueId());
           assertEquals( settingsService.getSemester(), contract.getSemester());
           assertEquals(application.getUniqueId(), contract.getApplication().getUniqueId());
           assertEquals(user, contract.getAdministrator());
           assertNotNull(contract.getCreationDate());
           assertNull(contract.getStudentSignature());
           assertNull(contract.getEmployerSignature());
           assertNull(contract.getAdministratorSignature());
           assertEquals(application.getStudent().getUniqueId(), contract.getCurrentUserUniqueId());

           return null;

        });

        contractService.create(application.getUniqueId());

    }

    @Test
    public void awaitSignature(){

        //ARRANGE

        User user = new User();
        user.setUniqueId(UUID.randomUUID());
        user.setType(User.Type.ADMINISTRATOR);
        user.setEmail("admin@admin.com");
        user.setFirstName("Admin");
        user.setLastName("Admin");

        User employer = new User();
        employer.setUniqueId(UUID.randomUUID());
        employer.setType(User.Type.EMPLOYER);
        employer.setEmail("employer@employer.com");
        employer.setFirstName("employer");
        employer.setLastName("employer");

        User student = new User();
        student.setUniqueId(UUID.randomUUID());
        student.setType(User.Type.STUDENT);
        student.setEmail("student@student.com");
        student.setFirstName("student");
        student.setLastName("student");

        InternshipOffer internshipOffer = new InternshipOffer();
        internshipOffer.setUniqueId(UUID.randomUUID());
        internshipOffer.setEmployer(employer.getUniqueId());


        InternshipApplication application = new InternshipApplication();
        application.setUniqueId(UUID.randomUUID());
        application.setSemester(settingsService.getSemester());
        application.setStudent(student);
        application.setOffer(internshipOffer);
        application.setStatus(InternshipApplication.Status.APPROVED);
        application.setDate(new Date());
        application.setInterviewDate(new Date());


        Contract c = new Contract();
        c.setUniqueId(UUID.randomUUID());
        c.setSemester(settingsService.getSemester());
        c.setStatus(Contract.Status.STUDENT);
        c.setApplication(application);
        c.setAdministrator(user);
        c.setCreationDate(new Date());
        c.setStudentSignature(null);
        c.setEmployerSignature(null);
        c.setAdministratorSignature(null);
        c.setCurrentUserUniqueId(application.getStudent().getUniqueId());

        ContractService contractService = new ContractService(internshipApplicationRepository, userRepository, null, contractRepository, settingsService );

        when (contractRepository.findAllBySemesterAndCurrentUserUniqueId(settingsService.getSemester(), c.getCurrentUserUniqueId())).thenReturn(List.of(c));


        // ACT

        ContractListResponse response = contractService.awaitingSignature(c.getCurrentUserUniqueId());

        ContractListResponse.Contract contract = response.getContracts().get(0);

        // ASSERT

        assertEquals(c.getUniqueId(), contract.getUniqueId());
        assertEquals(c.getSemester(), contract.getSemester());
        assertEquals(c.getApplication(), contract.getApplication());
        assertEquals(c.getAdministrator(), contract.getAdministrator());
        assertEquals(c.getCreationDate(), contract.getCreationDate());
        assertNull(contract.getStudentSignature());
        assertNull(contract.getEmployerSignature());
        assertNull(contract.getAdministratorSignature());
        assertEquals(c.getCurrentUserUniqueId(), contract.getCurrentUserUniqueId());

    }



}
