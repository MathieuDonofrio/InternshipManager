package cal.internshipmanager.request;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.List;
import java.util.UUID;

@Data
public class InternshipApplicationCreationRequest implements Serializable {

    @NotNull
    private UUID offerUniqueId;

    @NotNull
    private List<MultipartFile> files;
}
