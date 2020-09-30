package cal.internshipmanager.response;

import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
public class InternshipOfferListResponse {

    //
    // Fields
    //

    private List<InternshipOffer> internshipOffers;


    //
    // Inner classes & Enums
    //

    @Data
    public static class InternshipOffer {

        private UUID uniqueId;

        private UUID employer;

        private String status;

        private String company;

        private String jobTitle;

        private Long startDate;

        private int duration;

        private float salary;

        private float hours;

    }

    //
    // Mapping
    //

    public static InternshipOffer map(cal.internshipmanager.model.InternshipOffer from)
    {
        InternshipOffer internshipOffer = new InternshipOffer();

        internshipOffer.uniqueId = from.getUniqueId();
        internshipOffer.employer = from.getEmployer();
        internshipOffer.status = from.getStatus().toString();
        internshipOffer.company = from.getCompany();
        internshipOffer.jobTitle = from.getJobTitle();
        internshipOffer.startDate = from.getStartDate().getTime();
        internshipOffer.duration = from.getDuration();
        internshipOffer.salary = from.getSalary();
        internshipOffer.hours = from.getHours();

        return internshipOffer;
    }

}
