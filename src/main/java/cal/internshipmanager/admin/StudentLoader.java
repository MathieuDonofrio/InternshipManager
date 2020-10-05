package cal.internshipmanager.admin;

import cal.internshipmanager.model.User;
import cal.internshipmanager.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Order(2)
@Component
public class StudentLoader implements CommandLineRunner {

    //
    // Dependencies
    //

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    public static final int STUDENT_COUNT = 20;

    //
    // Constructors
    //

    @Autowired
    public StudentLoader(UserRepository userRepository, PasswordEncoder passwordEncoder) {
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
        if (userRepository.findAllByType("STUDENT").isEmpty()) {
            for (int i = 0; i < STUDENT_COUNT; i++) {
                Load("student" + i + "@student.com", "student", "student", "123456");
            }
        }
    }


    private void Load(String email, String firstName, String lastName, String password) {

        User user = new User();

        user.setUniqueId(UUID.randomUUID());
        user.setType("STUDENT");
        user.setEmail(email);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setPasswordHash(passwordEncoder.encode(password));

        userRepository.save(user);
    }

}
