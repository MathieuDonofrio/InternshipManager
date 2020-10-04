package cal.internshipmanager.admin;

import cal.internshipmanager.model.InternshipOffer;
import cal.internshipmanager.model.User;
import cal.internshipmanager.repository.InternshipOfferRepository;
import cal.internshipmanager.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static cal.internshipmanager.admin.EmployerLoader.EMPLOYER_COUNT;
import static cal.internshipmanager.admin.StudentLoader.STUDENT_COUNT;

@Order(4)
@Component
public class InternshipOfferLoader implements CommandLineRunner {

    //
    // Dependencies
    //

    private final InternshipOfferRepository internshipOfferRepository;

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    //
    // Constructors
    //

    @Autowired
    public InternshipOfferLoader(UserRepository userRepository, PasswordEncoder passwordEncoder, InternshipOfferRepository internshipOfferRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.internshipOfferRepository = internshipOfferRepository;
    }

    //
    // Services
    //

    @Override
    public void run(String... args) throws Exception {
        LoadAllInternshipsIfAbsent();
    }

    //
    // Private Methods
    //

    private void LoadAllInternshipsIfAbsent() {
        
        if (internshipOfferRepository.findAll().isEmpty()) {
            for (int i = 0; i < 20; i++) {
                Load();
            }
        }
    }

    private void Load() {

        InternshipOffer internshipOffer = new InternshipOffer();

        internshipOffer.setUniqueId(UUID.randomUUID());
        internshipOffer.setEmployer(GetRandomEmployerUUID());
        internshipOffer.setStatus(getRandomStatus());
        internshipOffer.setCompany("Hydro-Québec");
        internshipOffer.setJobTitle("Developper");
        internshipOffer.setJobScope(Arrays.asList("You must be as good as Mathieu", "You must be as good as Mathieu", "You must be as good as Mathieu", "You must be as good as Mathieu", "You must be as good as Mathieu"));
        internshipOffer.setStartDate(new Date());
        internshipOffer.setDuration(RandomBetween(8, 16));
        internshipOffer.setSalary(RandomBetween(15, 21));
        internshipOffer.setHours(RandomBetween(33, 35));
        internshipOffer.setUsers(GetRandomStudentAmount());

        internshipOfferRepository.save(internshipOffer);
        
    }

    //
    //  Utilities
    //

    public static InternshipOffer.Status getRandomStatus(){
        return InternshipOffer.Status.values()[
                ThreadLocalRandom.current().nextInt(InternshipOffer.Status.values().length)];
    }

    private UUID GetRandomEmployerUUID() {
        List<User> employers = userRepository.findAllByType("EMPLOYER");
        return employers.get(ThreadLocalRandom.current().nextInt(employers.size())).getUniqueId();
    }

    private List<User> GetRandomStudentAmount() {
        return Optional.ofNullable(userRepository.findAllByType("STUDENT"))
                .map(List::stream).orElseGet(Stream::empty)
                .skip(RandomBetween(8, STUDENT_COUNT))
                .collect(Collectors.toList());
    }

    private int RandomBetween(int min, int max) {
        return ThreadLocalRandom.current().nextInt(min, max);
    }

}
