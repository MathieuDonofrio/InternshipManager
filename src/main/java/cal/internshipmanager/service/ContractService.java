package cal.internshipmanager.service;

import cal.internshipmanager.model.InternshipApplication;
import cal.internshipmanager.model.InternshipOffer;
import cal.internshipmanager.model.User;
import cal.internshipmanager.repository.InternshipApplicationRepository;
import cal.internshipmanager.repository.InternshipOfferRepository;
import cal.internshipmanager.repository.UserRepository;
import com.itextpdf.text.Document;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.PdfWriter;
import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Autowired;
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
    public byte[] generate(UUID uniqueId) {

        // TODO will be changed compleatly

        InternshipApplication application = internshipApplicationRepository.findById(uniqueId).orElse(null);

        User student = application.getStudent();

        InternshipOffer offer = application.getOffer();

        ByteArrayOutputStream stream = new ByteArrayOutputStream();

        Document document = new Document();

        PdfWriter.getInstance(document, stream);

        document.open();

        document.add(new Paragraph("Contract proof of work!!! Application Id: " + uniqueId));
        document.add(new Paragraph());
        document.add(new Paragraph("Student: " + student.getFirstName() + ", " + student.getLastName()));
        document.add(new Paragraph("Company: " + offer.getCompany()));
        document.add(new Paragraph("Job Title: " + offer.getJobTitle()));

        document.close();

        return stream.toByteArray();
    }
}
