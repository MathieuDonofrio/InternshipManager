package cal.internshipmanager.response;

import cal.internshipmanager.model.InternshipApplication;
import cal.internshipmanager.model.InternshipOffer;
import cal.internshipmanager.model.User;
import cal.internshipmanager.repository.InternshipOfferRepository;
import cal.internshipmanager.repository.UserRepository;
import lombok.Data;
import org.springframework.data.annotation.Id;

import java.util.Date;
import java.util.List;
import java.util.UUID;

@Data
public class InternshipApplicationListResponse {

    //
    // Fields
    //

    private List<InternshipApplication> applications;

    //
    // Inner classes & Enums
    //

    @Data
    public static class InternshipApplication {

        private UUID uniqueId;

        private UUID studentUniqueId;

        private String studentFirstName;

        private String studentLastName;

        private UUID offerUniqueId;

        private String company;

        private String jobTitle;

        private Long date;

        private String status;

    }

    //
    // Mapping
    //

    public static InternshipApplication map(UserRepository userRepository,
                                            InternshipOfferRepository internshipOfferRepository,
                                            cal.internshipmanager.model.InternshipApplication from) {

        User student = userRepository.findById(from.getStudentUniqueId()).orElse(null);

        InternshipOffer internshipOffer = internshipOfferRepository.findById(from.getOfferUniqueId()).orElse(null);

        InternshipApplication application = new InternshipApplication();

        application.uniqueId = from.getUniqueId();
        application.studentUniqueId = from.getStudentUniqueId();
        application.studentFirstName = student.getFirstName();
        application.studentLastName = student.getLastName();
        application.offerUniqueId = from.getOfferUniqueId();
        application.company = internshipOffer.getCompany();
        application.jobTitle = internshipOffer.getJobTitle();
        application.date = from.getDate().getTime();
        application.status = from.getStatus().toString();

        return application;
    }

}
