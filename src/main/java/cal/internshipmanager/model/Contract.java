package cal.internshipmanager.model;

import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Document;

import java.io.Serializable;
import java.util.UUID;

@Document
@Data
public class Contract implements Serializable {

    //
    // Fields
    //

    private UUID uniqueId;

    private String semester;

    private InternshipApplication application;

    private User student;

    private User employer;

    private User administrateur;

    private Signature studentSignature;

    private Signature employerSignature;

    private Signature administratorSignature;

}
