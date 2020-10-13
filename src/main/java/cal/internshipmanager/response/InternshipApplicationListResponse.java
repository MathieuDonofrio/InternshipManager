package cal.internshipmanager.response;

import cal.internshipmanager.model.InternshipApplication;
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

        private UUID offerUniqueId;

        private Long date;

<<<<<<< HEAD

=======
        private String status;
>>>>>>> 28093cf6bcc48b4392a516b33a15d65c63f69e3e

    }

    //
    // Mapping
    //

    public static InternshipApplication map(cal.internshipmanager.model.InternshipApplication from) {
        InternshipApplication application = new InternshipApplication();

        application.uniqueId = from.getUniqueId();
        application.studentUniqueId = from.getStudentUniqueId();
        application.offerUniqueId = from.getOfferUniqueId();
        application.date = from.getDate().getTime();
        application.status = from.getStatus().toString();

        return application;
    }

}
