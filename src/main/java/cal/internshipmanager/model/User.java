package cal.internshipmanager.model;

import lombok.Data;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.io.Serializable;
import java.util.UUID;

@Document
@Data
public class User implements Serializable {

    /**
     * 128-bit immutable unique identifier
     * <p>
     * Contains creation timestamp
     */
    @Id
    private UUID uniqueId;

    /**
     * Descriminator
     * <p>
     * Type of user
     */
    private String type;

    /**
     * Mutable email
     */
    private String email;

    /**
     * Mutable password hash
     * <p>
     * Must be matched using appropriate password encoder
     */
    private String passwordHash;

    /**
     * Mutable First name
     */
    private String firstName;

    /**
     * Mutable Last name
     */
    private String lastName;

    /**
     * Mutable Company
     */
    private String company;


}
