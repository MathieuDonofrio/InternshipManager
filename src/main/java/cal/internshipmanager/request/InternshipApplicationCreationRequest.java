package cal.internshipmanager.request;

import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.UUID;

@Data
public class InternshipApplicationCreationRequest implements Serializable {

    @NotNull
    private UUID offerUniqueId;
}
