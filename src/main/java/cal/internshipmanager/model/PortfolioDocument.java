package cal.internshipmanager.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.UUID;

@Document
@Data
public class PortfolioDocument {

    //
    // Fields
    //

    @Id
    private UUID uniqueId;

    private UUID userUniqueId;

    private String fileName;

    private String fileType;

    private String type;

    private Date uploadDate;

    private byte[] data;

}
