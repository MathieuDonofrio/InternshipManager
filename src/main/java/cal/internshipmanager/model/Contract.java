package cal.internshipmanager.model;

import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Document;

import java.io.Serializable;
import java.util.Date;
import java.util.UUID;

@Document
@Data
public class Contract implements Serializable {

    //
    // Fields
    //

    private UUID uniqueId;

    private String semester;

    private Status status;

    private InternshipApplication application;

    private User administrator;

    private Date creationDate;

    private Signature studentSignature;

    private Signature employerSignature;

    private Signature administratorSignature;

    private UUID currentUserUniqueId;

    public enum Status {
        STUDENT, EMPLOYER, ADMINISTRATOR, COMPLETED
    }

}
