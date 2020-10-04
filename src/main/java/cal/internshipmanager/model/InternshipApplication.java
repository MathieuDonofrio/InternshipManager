package cal.internshipmanager.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.io.Serializable;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Document
@Data
public class InternshipApplication implements Serializable {

    //
    // Fields
    //

    @Id
    private UUID uniqueId;

    private UUID studentUniqueId;

    private UUID offerUniqueId;

    private Date date;

    private List<PortfolioDocument> documents;

}
