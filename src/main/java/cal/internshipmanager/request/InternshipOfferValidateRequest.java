package cal.internshipmanager.request;

import lombok.Data;

import javax.validation.constraints.NotBlank;
import java.io.Serializable;
import java.util.UUID;

@Data
public class InternshipOfferValidateRequest implements Serializable {


    /**
     * 128-bit immutable unique identifier
     * <p>
     * Contains creation timestamp
     */
    @NotBlank
    private UUID uniqueId;

    /**
     * Approval flag. True if approved,
     * false otherwise.
     */
    @NotBlank
    private boolean approved;
}
