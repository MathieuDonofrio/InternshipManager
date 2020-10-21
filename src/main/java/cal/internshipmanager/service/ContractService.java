package cal.internshipmanager.service;

import cal.internshipmanager.model.InternshipApplication;
import cal.internshipmanager.repository.InternshipApplicationRepository;
import cal.internshipmanager.repository.InternshipOfferRepository;
import cal.internshipmanager.repository.PortfolioDocumentRepository;
import cal.internshipmanager.repository.UserRepository;
import cal.internshipmanager.security.JwtProvider;
import cal.internshipmanager.validator.ExistingInternshipApplication;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Header;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.PdfDocument;
import com.itextpdf.text.pdf.PdfWriter;
import lombok.SneakyThrows;
import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.parameters.P;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import javax.validation.Valid;
import java.io.ByteArrayOutputStream;
import java.util.UUID;

@Service
@Validated
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
    public byte[] generateContract(@Valid @ExistingInternshipApplication UUID uniqueId) {

        InternshipApplication application = internshipApplicationRepository.findById(uniqueId).orElse(null);

        PdfDocument pdfdoc = new PdfDocument();

        pdfdoc.add(new Paragraph("Contrat (Proof of work)"));
        pdfdoc.add(new Paragraph("Application UUID: " + uniqueId));

        ByteArrayOutputStream stream = new ByteArrayOutputStream();

        PdfWriter.getInstance(pdfdoc, stream);

        pdfdoc.open();
        pdfdoc.close();

        return stream.toByteArray();
    }
}
