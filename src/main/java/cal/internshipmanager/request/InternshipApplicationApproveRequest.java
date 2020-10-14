package cal.internshipmanager.request;

import cal.internshipmanager.model.InternshipApplication;
import lombok.Data;

import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.UUID;

@Data
public class InternshipApplicationApproveRequest implements Serializable {

    @NotNull(message = "Unique id is mandatory")
    private UUID uniqueId;

    private InternshipApplication.Status status;
}
