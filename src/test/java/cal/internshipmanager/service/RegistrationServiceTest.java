package cal.internshipmanager.service;

import cal.internshipmanager.model.User;
import cal.internshipmanager.repository.UserRepository;
import cal.internshipmanager.request.EmployerRegistrationRequest;
import cal.internshipmanager.request.StudentRegistrationRequest;
import cal.internshipmanager.response.RegistrationResponse;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class RegistrationServiceTest {

    @Mock
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Test
    public void student_validRequest() {

        // Arrange

        RegistrationService service = new RegistrationService(userRepository, passwordEncoder);

        StudentRegistrationRequest request = new StudentRegistrationRequest();

        request.setEmail("test@test.com");
        request.setFirstName("test");
        request.setLastName("test");
        request.setPassword("123456789");

        // Act & Assert

        Mockito.when(userRepository.save(Mockito.any())).then(inv -> {

            User user = (User) inv.getArgument(0);

            assertNotNull(user.getUniqueId());
            assertEquals(request.getEmail(), user.getEmail());
            assertEquals(request.getFirstName(), user.getFirstName());
            assertEquals(request.getLastName(), user.getLastName());
            assertEquals("STUDENT", user.getType());
            assertTrue(passwordEncoder.matches(request.getPassword(), user.getPasswordHash()));

            return null;
        });

        RegistrationResponse response = service.student(request);

        assertNotNull(response);

        assertNotNull(response.getUserUniqueId());
    }

    @Test
    public void employer_validRequest() {

        // Arrange

        RegistrationService service = new RegistrationService(userRepository, passwordEncoder);

        EmployerRegistrationRequest request = new EmployerRegistrationRequest();

        request.setEmail("test@test.com");
        request.setFirstName("test");
        request.setLastName("test");
        request.setPassword("123456789");
        request.setCompany("TestCorp");

        // Act & Assert

        Mockito.when(userRepository.save(Mockito.any())).then(inv -> {

            User user = (User) inv.getArgument(0);

            assertEquals(request.getEmail(), user.getEmail());
            assertEquals(request.getFirstName(), user.getFirstName());
            assertEquals(request.getLastName(), user.getLastName());
            assertEquals("EMPLOYER", user.getType());
            assertEquals(request.getCompany(), user.getCompany());
            assertTrue(passwordEncoder.matches(request.getPassword(), user.getPasswordHash()));

            return null;
        });

        RegistrationResponse response = service.employer(request);

        assertNotNull(response);

        assertNotNull(response.getUserUniqueId());
    }

}
