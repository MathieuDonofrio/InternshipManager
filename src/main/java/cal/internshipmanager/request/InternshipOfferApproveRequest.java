package cal.internshipmanager.request;

import lombok.Data;

import javax.validation.constraints.NotBlank;
import java.io.Serializable;
import java.util.UUID;

@Data
public class InternshipOfferApproveRequest implements Serializable {

    @NotBlank
    private UUID uniqueId;

}
