package cal.internshipmanager.service;

import cal.internshipmanager.model.User;
import cal.internshipmanager.repository.UserRepository;
import cal.internshipmanager.request.EmployerRegistrationRequest;
import cal.internshipmanager.request.StudentRegistrationRequest;
import cal.internshipmanager.response.RegistrationResponse;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import javax.validation.Valid;
import java.util.UUID;

@Service
@Validated
public class RegistrationService {

    //
    // Dependencies
    //

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    //
    // Constructors
    //

    public RegistrationService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    //
    // Services
    //

    /**
     * Registers a student if the request is valid.
     *
     * @param request student registration request
     *
     * @return registration response
     */
    public RegistrationResponse registerStudent(@Valid StudentRegistrationRequest request) {

        User user = new User();

        user.setUniqueId(UUID.randomUUID());
        user.setType("STUDENT");
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());

        userRepository.save(user);

        RegistrationResponse response = new RegistrationResponse();

        response.setUserUniqueId(user.getUniqueId());

        return response;
    }

    /**
     * Registers a employer if the request is valid.
     *
     * @param request employer registration request
     *
     * @return registration response
     */
    public RegistrationResponse registerEmployer(@Valid EmployerRegistrationRequest request) {

        User user = new User();

        user.setUniqueId(UUID.randomUUID());
        user.setType("EMPLOYER");
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setCompany(request.getCompany());

        userRepository.save(user);

        RegistrationResponse response = new RegistrationResponse();

        response.setUserUniqueId(user.getUniqueId());

        return response;
    }

}
