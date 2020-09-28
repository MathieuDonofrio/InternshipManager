package cal.internshipmanager.service;

import cal.internshipmanager.model.User;
import cal.internshipmanager.repository.UserRepository;
import cal.internshipmanager.request.AuthenticationRequest;
import cal.internshipmanager.response.AuthenticationResponse;
import cal.internshipmanager.security.JwtProvider;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class AuthenticationServiceTest {

    @Mock
    private UserRepository userRepository;

    @Autowired
    private JwtProvider jwtProvider;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Test
    public void authenticate_validRequest() {

        // Arrange

        AuthenticationService service = new AuthenticationService(userRepository, jwtProvider, passwordEncoder);

        AuthenticationRequest request = new AuthenticationRequest();

        request.setEmail("test@test.com");
        request.setPassword("123456789");

        User user = new User();

        user.setUniqueId(UUID.randomUUID());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));

        Mockito.when(userRepository.findByEmail(Mockito.any())).thenReturn(Optional.of(user));

        // Act

        AuthenticationResponse response = service.authenticate(request);

        // Assert

        assertNotNull(response);

        assertEquals(user.getUniqueId(), response.getUserUniqueId());
        assertNotNull(response.getToken());
    }

    @Test
    public void authenticate_invalidRequest() {

        // Arrange

        AuthenticationService service = new AuthenticationService(userRepository, jwtProvider, passwordEncoder);

        AuthenticationRequest request = new AuthenticationRequest();

        request.setEmail("test@test.com");
        request.setPassword("123456789");

        User user = new User();

        user.setUniqueId(UUID.randomUUID());
        user.setEmail(request.getEmail());
        user.setType("STUDENT");
        user.setPasswordHash(passwordEncoder.encode("123456789"));

        Mockito.when(userRepository.findByEmail(Mockito.any())).thenReturn(Optional.of(user));

        // Act & Assert

        AuthenticationResponse response = service.authenticate(request);

        assertNotNull(response);

        assertEquals(user.getUniqueId(), response.getUserUniqueId());
        assertEquals(user.getType(), response.getUserType());
        assertNotNull(response.getToken());
    }

}
