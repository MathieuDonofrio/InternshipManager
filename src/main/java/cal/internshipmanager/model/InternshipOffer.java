package cal.internshipmanager.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.io.Serializable;
import java.util.Date;
import java.util.List;
import java.util.Random;
import java.util.UUID;

@Document
@Data
public class InternshipOffer implements Serializable {

    //
    // Fields
    //

    @Id
    private UUID uniqueId;

    private UUID employer;

    private Status status;

    private String company;

    private String jobTitle;

    private List<String> jobScope;

    private Date startDate;

    private int duration;

    private float salary;

    private float hours;

    private List<User> users;

    //
    // Inner classes & Enums
    //

    public enum Status {
        PENDING_APPROVAL, APPROVED, REJECTED;

        public static Status getRandom(){
            int max = values().length - 1;
            int min = 0;
            return values()[(int)Math.floor(Math.random() * (max - min + 1)) + min];
        }
    }

}