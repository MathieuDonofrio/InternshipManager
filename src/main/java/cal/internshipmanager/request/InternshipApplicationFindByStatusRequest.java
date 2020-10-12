package cal.internshipmanager.request;

import cal.internshipmanager.model.InternshipApplication;
import cal.internshipmanager.validator.ExistingInternshipApplication;
import lombok.Data;

import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.UUID;

@Data
public class InternshipApplicationFindByStatusRequest implements Serializable {

    @NotNull
    private InternshipApplication.Status status;
}
