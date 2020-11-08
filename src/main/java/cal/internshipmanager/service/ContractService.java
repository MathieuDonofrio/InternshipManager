package cal.internshipmanager.service;

import cal.internshipmanager.model.InternshipApplication;
import cal.internshipmanager.model.InternshipOffer;
import cal.internshipmanager.repository.InternshipApplicationRepository;
import cal.internshipmanager.repository.InternshipOfferRepository;
import cal.internshipmanager.repository.UserRepository;
import cal.internshipmanager.response.DownloadFileResponse;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfWriter;
import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.util.UUID;

@Service
public class ContractService {

    //
    // Dependencies
    //

    private final InternshipApplicationRepository internshipApplicationRepository;

    private final UserRepository userRepository;

    private final InternshipOfferRepository internshipOfferRepository;

    //
    // Constructors
    //

    @Autowired
    public ContractService(InternshipApplicationRepository internshipApplicationRepository,
                           UserRepository userRepository,
                           InternshipOfferRepository internshipOfferRepository) {
        this.internshipApplicationRepository = internshipApplicationRepository;
        this.userRepository = userRepository;
        this.internshipOfferRepository = internshipOfferRepository;
    }

    //
    // Services
    //

    @SneakyThrows
    public DownloadFileResponse generate(UUID uniqueId) {





        // TODO will be changed compleatly



        ByteArrayOutputStream stream = new ByteArrayOutputStream();

        Document document = new Document();

        PdfWriter.getInstance(document, stream);

        document.open();

        write(uniqueId, document);

        document.close();
        byte[] data= stream.toByteArray();
        DownloadFileResponse response = new DownloadFileResponse();

        response.setName("Contrat");
        response.setType("application/pdf");
        response.setResource(new ByteArrayResource(data));
        response.setLength(data.length);

        return response;
    }

    private void write(UUID uniqueId, Document document) throws DocumentException {
        InternshipApplication application = internshipApplicationRepository.findById(uniqueId).orElse(null);

        InternshipOffer offer = application.getOffer();

        Font font = FontFactory.getFont(FontFactory.COURIER, 16, BaseColor.BLACK);
        Chunk chunk = new Chunk("Hello World", font);

        
        document.add((chunk));
        document.add(new Paragraph("Contract proof of work!!! Application Id: " + uniqueId));
        //document.add(new Paragraph());
        //document.add(new Paragraph("Student: " + student.getFirstName() + ", " + student.getLastName()));
        //document.add(new Paragraph("Company: " + offer.getCompany()));
        //document.add(new Paragraph("Job Title: " + offer.getJobTitle()));
    }
}
