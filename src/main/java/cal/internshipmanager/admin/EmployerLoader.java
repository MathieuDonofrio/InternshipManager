package cal.internshipmanager.admin;

import cal.internshipmanager.model.User;
import cal.internshipmanager.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Order(3)
@Component
public class EmployerLoader implements CommandLineRunner {

    //
    // Dependencies
    //

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    public static final int EMPLOYER_COUNT = 6;

    //
    // Constructors
    //

    @Autowired
    public EmployerLoader(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    //
    // Services
    //

    @Override
    public void run(String... args) throws Exception {
        LoadEveryoneIfAbsent();
    }

    //
    // Private Methods
    //

    private void LoadEveryoneIfAbsent() {
        if (userRepository.findAllByType("EMPLOYER").isEmpty()) {
            for (int i = 0; i <= EMPLOYER_COUNT; i++) {
                Load("employer" + i + "@employer.com", "employer", "employer", "123456");
            }
        }
    }


    private void Load(String email, String firstName, String lastName, String password) {

        User user = new User();

        user.setUniqueId(UUID.randomUUID());
        user.setType("EMPLOYER");
        user.setEmail(email);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setPasswordHash(passwordEncoder.encode(password));

        userRepository.save(user);
    }

}
