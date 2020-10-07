package cal.internshipmanager.request;

import lombok.Data;

import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.UUID;

@Data
public class PortfolioDocumentDeleteRequest implements Serializable {

    @NotNull(message = "Portfolio document unique id is mandatory")
    private UUID uniqueId;

}
