package cal.internshipmanager.request;

import cal.internshipmanager.model.InternshipApplication;
import cal.internshipmanager.validator.ExistingInternshipApplication;
import lombok.Data;

import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.List;
import java.util.UUID;

@Data
public class InternshipApplicationEditRequest implements Serializable {

    @NotNull(message = "Application unique id is mandatory")
    @ExistingInternshipApplication
    private UUID applicationId;

    @NotNull
    private InternshipApplication.Status status;
}
