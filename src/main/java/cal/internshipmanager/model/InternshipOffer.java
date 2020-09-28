package cal.internshipmanager.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Document
@Data
public class InternshipOffer implements Serializable {

    /**
     * 128-bit immutable unique identifier
     * <p>
     * Contains creation timestamp
     */
    @Id
    private UUID uniqueId;

    /**
     * UUID of the employer that created this internship
     * offer.
     */
    private UUID employer;

    /**
     * Mutable internship offer status
     */
    private InternshipOfferStatus status;

    /**
     * Mutable company
     */
    private String company;

    /**
     * Mutable job title
     */
    private String jobTitle;

    /**
     * Mutable job scope array
     */
    private List<String> jobScope;

    /**
     * Mutable start date
     */
    private Date startDate;

    /**
     * Mutable duration
     * <p>
     * contains duration of internShip offer in weeks
     */
    private int duration;

    /**
     * Mutable salary
     * <p>
     * contains amount of money per hours of internship offer
     */
    private float salary;

    /**
     * Mutable hours
     * <p>
     * contains hours per week of internShip offer
     */
    private float hours;

    /**
     * Enum used to flag the current internship offer status.
     */
    public enum InternshipOfferStatus{
        PENDING_APPROVAL, APPROVED, REJECTED
    }

}
