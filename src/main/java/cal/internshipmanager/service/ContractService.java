package cal.internshipmanager.service;

import cal.internshipmanager.model.InternshipApplication;
import cal.internshipmanager.model.InternshipOffer;
import cal.internshipmanager.model.User;
import cal.internshipmanager.repository.InternshipApplicationRepository;
import cal.internshipmanager.repository.InternshipOfferRepository;
import cal.internshipmanager.repository.UserRepository;
import cal.internshipmanager.response.DownloadFileResponse;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.util.UUID;
import java.util.stream.Stream;

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

    public void create(UUID applicationUniqueId) {

        final Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        UUID userUniqueId = UUID.fromString((String) authentication.getPrincipal());

        User user = userRepository.findById(userUniqueId).get();



    }

    @SneakyThrows
    public DownloadFileResponse generate(UUID uniqueId) {

        ByteArrayOutputStream stream = new ByteArrayOutputStream();

        Document document = new Document();

        PdfWriter writer = PdfWriter.getInstance(document, stream);

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

    private void addTableHeader(PdfPTable table) {
        Stream.of("column header 1")
                .forEach(columnTitle -> {
                    PdfPCell header = new PdfPCell();
                    //header.setBackgroundColor(BaseColor.LIGHT_GRAY);
                    header.setBorderWidth(1);
                    header.setPhrase(new Phrase(columnTitle));
                    table.addCell(header);
                });
    }

    private void addRows(PdfPTable table) {
        Stream.of("column header 1")
                .forEach(columnTitle -> {
                    PdfPCell header = new PdfPCell();
                    //header.setBackgroundColor(BaseColor.LIGHT_GRAY);
                    header.setBorderWidth(1);
                    header.setPhrase(new Phrase(columnTitle));
                    table.addCell(columnTitle);
                });
    }

    private static void addEmptyLine(Paragraph paragraph, int number) {
        for (int i = 0; i < number; i++) {
            paragraph.add(new Paragraph(" "));
        }
    }

    @SneakyThrows
    private void write(UUID uniqueId, Document document) throws DocumentException {
        InternshipApplication application = internshipApplicationRepository.findById(uniqueId).orElse(null);

        User student = application.getStudent();
        InternshipOffer offer = application.getOffer();

        Font font = FontFactory.getFont(FontFactory.COURIER, 16, BaseColor.BLACK);
        Font catFont = new Font(Font.FontFamily.TIMES_ROMAN, 18, Font.BOLD);
        Rectangle r = new Rectangle(36, 36, 559, 806);
        r.setBorder(Rectangle.BOX);
        r.setBorderWidth(1);
        r.setBorderColor(BaseColor.BLACK);
        Chunk chunk = new Chunk("Hello World");
        Paragraph p = new Paragraph("Cegep Andre-Laurendeau");
        p.setExtraParagraphSpace(5);
        Paragraph p2 = new Paragraph();

        p.setAlignment(Paragraph.ALIGN_MIDDLE);
        addEmptyLine(p2, 17);
        p2.add(setNewMIddleParagraph("Entente de stage cooperatif"));
        addEmptyLine(p2, 1);
        p2.add(setNewMIddleParagraph("Technique informatique"));
        addEmptyLine(p2, 19);
        p2.add(setNewMIddleParagraph("Current date :)"));
        p2.setAlignment(Paragraph.ALIGN_CENTER);
        document.setMargins(5,5,5,5);
        //document.addHeader("Juice","chunk");
        document.addTitle("Contrat");
        document.add(p);
        document.add(p2);
        document.add(r);




//-------------------------------------------------


        document.newPage();
        document.add(setNewEmptyParagraph(3));
        document.add(setNewMIddleParagraph("ENTENTE INTERVENUE ENTRE LES PARTIES SUIVANTES"));
        document.add(setNewEmptyParagraph(1));
        document.add(setNewMIddleParagraph("Dans le cadre de la formule Alternance travail-etudes du programme de"));
        document.add(setNewMIddleParagraph("TECHNIQUE INFORMATIQUE, les parties citees ci-dessous :"));
        document.add(setNewEmptyParagraph(1));
        Rectangle r2 = new Rectangle(36, 586, 559, 686);
        r2.setBorder(Rectangle.BOX);
        r2.setBorderWidth(1);
        r2.setBorderColor(BaseColor.BLACK);
        document.add(r2);
        document.add(setNewEmptyParagraph(1));
        document.add(setNewMIddleParagraph("Le CEGEP ANDRE-LAURENDEAU, corporation legalement constitue, situe au"));
        document.add(setNewMIddleParagraph("1111, rue Lapierre, LASALLE(Quebec), H8N 2J4,"));
        document.add(setNewMIddleParagraph("ici represente par Monsieur Benoit Archambault"));
        document.add(setNewMIddleParagraph("ci-apres designe <<Le College>>"));
        document.add(setNewEmptyParagraph(2));
        document.add(setNewMIddleParagraph("et"));
        document.add(setNewEmptyParagraph(1));
        document.add(setNewMIddleParagraph("<Company Name> ayant sa place d'affaire au:"));
        document.add(setNewEmptyParagraph(1));
        PdfPTable table = new PdfPTable(1);
        PdfPTable table2 = new PdfPTable(2);
        table2.addCell(cellWithoutBorder("Addresse: "));
        table2.addCell(cellWithoutBorder("Ville: "));
        table2.addCell(cellWithoutBorder("Code Postal: "));
        table2.addCell(cellWithoutBorder("Telephone: "));
        PdfPCell cell = new PdfPCell(new Phrase("Nom de l'entreprise"));
        cell.setBackgroundColor(BaseColor.LIGHT_GRAY);
        table.addCell(cell);
        PdfPCell c2 = new PdfPCell(new Phrase("Personne contact en entreprise: <Emp loyeur here>"));
        c2.setBorder(PdfPCell.NO_BORDER + PdfPCell.LEFT + PdfPCell.RIGHT);
        table.addCell(c2);
        table.addCell(table2);
        table.setPaddingTop(15);
        document.add(table);
        document.add(setNewEmptyParagraph(3));
        PdfPTable table3 = new PdfPTable(1);
        PdfPTable table4 = new PdfPTable(2);
        table4.addCell(cellWithoutBorder("Addresse : "));
        table4.addCell(cellWithoutBorder("Ville : "));
        table4.addCell(cellWithoutBorder("Code Postal : "));
        table4.addCell(cellWithoutBorder("Telephone : "));
        table3.addCell(setTitleCell("ENDROIT DU STAGE"));
        PdfPCell c1 = new PdfPCell(new Phrase("Service ou departement : "));
        c1.setBorder(PdfPCell.NO_BORDER + PdfPCell.LEFT + PdfPCell.RIGHT);
        table3.addCell(c1);
        table3.addCell(table4);
        table3.addCell(setTitleCell("SUPERVISEUR DU STAGE"));
        PdfPTable table5 = new PdfPTable(2);
        table5.addCell(cellWithoutBorder("Nom: "));
        table5.addCell(cellWithoutBorder("Titre: "));
        table5.addCell(cellWithoutBorder("Telephone: "));
        table5.addCell(cellWithoutBorder("Poste : "));
        table5.addCell(cellWithoutBorder("Telecopieur : "));
        table5.addCell(cellWithoutBorder("Courriel : "));
        table3.addCell(table5);
        table3.addCell(setTitleCell("MODALITE DE SUPERVISION DU STAGIAIRE"));
        table3.addCell("Nombre d'heures / semaine prevu : 5h");
        table3.addCell(setTitleCell("DUREE DU STAGE : "));
        PdfPTable table6 = new PdfPTable(2);
        table6.addCell(cellWithoutBorder("Date de debut : 12 juin 2000"));
        table6.addCell(cellWithoutBorder("Date de fin : 123 septembre 2000"));
        table6.addCell("Nombre total d'heures par semaine : ");
        table3.addCell(table6);
        table3.addCell(setTitleCell("HORAIRE DE TRAVAIL"));
        PdfPCell c4 = new PdfPCell(new Phrase("Horaire de travail : 8h00 - 21h00"));
        c4.setBorder(PdfPCell.NO_BORDER + PdfPCell.LEFT + PdfPCell.RIGHT);
        table3.addCell(c4);
        PdfPCell c5 = new PdfPCell(new Phrase("Nombre total d'heures par semaine : 90h"));
        c5.setBorder(PdfPCell.NO_BORDER + PdfPCell.LEFT + PdfPCell.RIGHT);
        table3.addCell(c5);
        table3.addCell(setTitleCell("SALAIRE"));
        PdfPCell c3 = new PdfPCell(new Phrase("Salaire horaire : XYZ$"));
        c3.setBorder(PdfPCell.NO_BORDER + PdfPCell.LEFT + PdfPCell.RIGHT + PdfPCell.BOTTOM);
        table3.addCell(c3);
        table.setPaddingTop(15);
        document.add(table3);
        //------------------------------------------------------------

        document.newPage();
        document.add(setNewEmptyParagraph(2));
        document.add(setNewMIddleParagraph("Conformement aux objectifs vises pour ce stage, les taches et les mandats suivant seront confies a l'etudiant stagiaire :"));
        document.add(setNewEmptyParagraph(2));
        Paragraph p4 = new Paragraph("TACHES ET RESPONSABILITES DU STAGIAIRE");
        document.add(p4);
        document.add(setNewEmptyParagraph(8));
        Rectangle r3 = new Rectangle(36, 606, 559, 706);
        r3.setBorder(Rectangle.BOX);
        r3.setBorderWidth(1);
        r3.setBorderColor(BaseColor.BLACK);
        document.add(r3);
        document.add(setNewEmptyParagraph(3));
        document.add(new Paragraph("---------"));
        document.add(new Paragraph("<Employeur Signature above line>"));
        document.add(setNewEmptyParagraph(2));
        document.add(setNewMIddleParagraph("RESPONSABILITES"));
        document.add(new Paragraph("Le College s'engage a : "));
        document.add(new Paragraph("L'entreprise s'engage a : "));
        document.add(new Paragraph("L'etudiant s'engage a : "));
        document.add(setNewEmptyParagraph(1));
        PdfPTable t = new PdfPTable(1);
        t.addCell(setTitleCell("SIGNATURES"));
        document.add(t);
        document.add(setNewMIddleParagraph("Les parties s'engagent a respecter cette entente de stage"));
        document.add(new Paragraph("En foi de quoi les parties ont signe,"));
    }
    private PdfPCell cellWithoutBorder(String message){
        PdfPCell cell = new PdfPCell(new Phrase(message));
        cell.setBorder(PdfPCell.NO_BORDER);
        return cell;
    }
    private PdfPCell setTitleCell(String message) {
        PdfPCell cell = new PdfPCell(new Phrase(message));
        cell.setBackgroundColor(BaseColor.LIGHT_GRAY);
        return cell;
    }

    private Paragraph setNewEmptyParagraph(int number) {
        Paragraph tmp = new Paragraph();
        for (int i = 0; i < number; i++) {
            tmp.add(new Paragraph(" "));
        }
        return tmp;
    }

    private Paragraph setNewRightParagraph(String message) {
        Paragraph tmp = new Paragraph(message);
        tmp.setAlignment(Paragraph.ALIGN_RIGHT);
        return tmp;
    }

    private Paragraph setNewMIddleParagraph(String message) {
        Paragraph tmp = new Paragraph(message);
        tmp.setAlignment(Paragraph.ALIGN_CENTER);
        return tmp;
    }
}
