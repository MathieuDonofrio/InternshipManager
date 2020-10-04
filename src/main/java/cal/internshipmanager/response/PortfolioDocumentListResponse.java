package cal.internshipmanager.response;

import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
public class PortfolioDocumentListResponse {

    //
    // Fields
    //

    private List<PortfolioDocument> portfolioDocuments;


    //
    // Inner classes & Enums
    //

    @Data
    public static class PortfolioDocument {

        private UUID uniqueId;

        private String fileName;

        private String type;

        private byte[] data;

    }

    //
    // Mapping
    //

    public static PortfolioDocument map(cal.internshipmanager.model.PortfolioDocument from) {
        PortfolioDocument portfolioDocument = new PortfolioDocument();

        portfolioDocument.uniqueId = from.getUniqueId();
        portfolioDocument.fileName = from.getFileName();
        portfolioDocument.type = from.getType();
        portfolioDocument.data = from.getData();

        return portfolioDocument;
    }

}
