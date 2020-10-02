package cal.internshipmanager.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.io.Serializable;
import java.util.Date;
import java.util.UUID;

@Document
@Data
public class InternshipApplication implements Serializable {


    @Id
    private UUID uniqueId;

    private UUID studentUniqueId;

    private UUID offerUniqueId;

    private Date date;
}
