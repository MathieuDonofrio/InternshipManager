package cal.internshipmanager.model;

import lombok.Data;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.io.Serializable;
import java.util.UUID;

@Document
@Data
public class User implements Serializable {

    //
    // Fields
    //

    @Id
    private UUID uniqueId;

    private String type;

    private String email;

    private String passwordHash;

    private String firstName;

    private String lastName;

    private String company;

}
