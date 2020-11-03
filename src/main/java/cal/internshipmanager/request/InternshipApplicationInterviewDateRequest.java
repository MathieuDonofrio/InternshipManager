package cal.internshipmanager.request;

import lombok.Data;

import javax.validation.constraints.NotNull;
import java.util.UUID;

@Data
public class InternshipApplicationInterviewDateRequest {

    @NotNull(message = "Documents are mandatory")
    private UUID uniqueId;

    private Long interviewDate;


}
