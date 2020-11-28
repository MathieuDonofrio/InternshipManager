package cal.internshipmanager.service;


import cal.internshipmanager.model.Contract;
import cal.internshipmanager.model.InternshipApplication;
import cal.internshipmanager.model.Signature;
import cal.internshipmanager.model.User;
import cal.internshipmanager.repository.ContractRepository;
import cal.internshipmanager.repository.InternshipApplicationRepository;
import cal.internshipmanager.repository.InternshipOfferRepository;
import cal.internshipmanager.repository.UserRepository;
import cal.internshipmanager.response.ContractListResponse;
import cal.internshipmanager.response.DownloadFileResponse;
import com.itextpdf.text.Document;
import com.itextpdf.text.pdf.PdfWriter;
import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;


@Service
public class ContractService {

    //
    // Dependencies
    //

    private final InternshipApplicationRepository internshipApplicationRepository;

    private final UserRepository userRepository;

    private final InternshipOfferRepository internshipOfferRepository;

    private final ContractRepository contractRepository;

    private final SettingsService settingsService;

    private final ContractPdfGenerator contractPdfGenerator;

    //
    // Constructors
    //

    @Autowired
    public ContractService(InternshipApplicationRepository internshipApplicationRepository,
                           UserRepository userRepository,
                           InternshipOfferRepository internshipOfferRepository,
                           ContractRepository contractRepository,
                           SettingsService settingsService,
                           ContractPdfGenerator contractPdfGenerator) {
        this.internshipApplicationRepository = internshipApplicationRepository;
        this.userRepository = userRepository;
        this.internshipOfferRepository = internshipOfferRepository;
        this.contractRepository = contractRepository;
        this.settingsService = settingsService;
        this.contractPdfGenerator = contractPdfGenerator;
    }

    //
    // Services
    //

    public ContractListResponse.Contract find(UUID uniqueId) {
        return ContractListResponse.map(contractRepository.findById(uniqueId).get());
    }

    public void sign(UUID uniqueId) {

        final Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        UUID userUniqueId = UUID.fromString((String) authentication.getPrincipal());

        Contract contract = contractRepository.findById(uniqueId).get();

        if (contract.getStatus() != Contract.Status.COMPLETED && contract.getCurrentUserUniqueId().equals(userUniqueId)) {
            User user = userRepository.findById(userUniqueId).get();

            if (user.getSignature() != null) {

                switch (contract.getStatus()) {
                    case STUDENT:
                        contract.setStudentSignature(user.getSignature());
                        contract.setCurrentUserUniqueId(contract.getApplication().getOffer().getEmployer());
                        contract.setStatus(Contract.Status.EMPLOYER);
                        contract.setStudentSignedDate(new Date());
                        break;
                    case EMPLOYER:
                        contract.setEmployerSignature(user.getSignature());
                        contract.setCurrentUserUniqueId(contract.getAdministrator().getUniqueId());
                        contract.setStatus(Contract.Status.ADMINISTRATOR);
                        contract.setEmployerSignedDate(new Date());
                        break;
                    case ADMINISTRATOR:
                        contract.setAdministratorSignature(user.getSignature());
                        contract.setCurrentUserUniqueId(null);
                        contract.setStatus(Contract.Status.COMPLETED);
                        contract.setAdministratorSignedDate(new Date());
                        break;
                    default:
                        break;
                }
            }
        }

        contractRepository.save(contract);
    }

    public ContractListResponse allContracts(UUID userUniqueId) {

        ContractListResponse response = new ContractListResponse();

        List<Contract> responseContractList = new ArrayList<>();

        User user = userRepository.findById(userUniqueId).get();

        switch (user.getType()) {
            case STUDENT:
                responseContractList = contractRepository.findAllBySemesterAndApplication_Student_UniqueId(settingsService.getSemester(), userUniqueId);
                break;
            case EMPLOYER:
                responseContractList = contractRepository.findAllBySemesterAndApplication_Offer_Employer(settingsService.getSemester(), userUniqueId);
                break;
            case ADMINISTRATOR:
                responseContractList = contractRepository.findAllBySemesterAndAdministrator_UniqueId(settingsService.getSemester(), userUniqueId);
                break;
        }

        response.setContracts(responseContractList.stream()
                .map(ContractListResponse::map).collect(Collectors.toList()));

        return response;
    }

    public ContractListResponse awaitingSignature(UUID userUniqueId) {

        ContractListResponse response = new ContractListResponse();

        response.setContracts(contractRepository
                .findAllBySemesterAndCurrentUserUniqueId(settingsService.getSemester(), userUniqueId).stream()
                .map(ContractListResponse::map).collect(Collectors.toList()));

        return response;
    }

    public ContractListResponse signedContracts(UUID userUniqueId) {

        ContractListResponse response = new ContractListResponse();

        User user = userRepository.findById(userUniqueId).get();

        if (user.getSignature() != null) {

            UUID signatureUUID = user.getSignature().getUniqueId();

            response.setContracts(contractRepository
                    .findAllBySemester(settingsService.getSemester())
                    .stream()
                    .filter(contract -> isSignaturePresent(contract, signatureUUID,user.getType()))
                    .map(ContractListResponse::map)
                    .collect(Collectors.toList()));
        }else{
            response.setContracts(new ArrayList<>());
        }

        return response;
    }

    private boolean isSignaturePresent(Contract contract, UUID signatureID, User.Type type) {
        Signature adminSignature = contract.getAdministratorSignature();
        Signature employerSignature = contract.getEmployerSignature();
        Signature studentSignature = contract.getStudentSignature();

        if (adminSignature != null && type.equals(User.Type.ADMINISTRATOR))
            return adminSignature.getUniqueId().equals(signatureID);
        else if (employerSignature != null && type.equals(User.Type.EMPLOYER))
            return employerSignature.getUniqueId().equals(signatureID);
        else if (studentSignature != null && type.equals(User.Type.STUDENT))
            return studentSignature.getUniqueId().equals(signatureID);

        return false;
    }

    // TODO add preauthorize for admin
    public void create(UUID applicationUniqueId) {

        final Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        UUID userUniqueId = UUID.fromString((String) authentication.getPrincipal());

        User administrator = userRepository.findById(userUniqueId).get();

        InternshipApplication application = internshipApplicationRepository.findById(applicationUniqueId).get();

        Contract contract = new Contract();

        contract.setUniqueId(UUID.randomUUID());
        contract.setSemester(settingsService.getSemester());
        contract.setStatus(Contract.Status.STUDENT);
        contract.setApplication(application);
        contract.setAdministrator(administrator);
        contract.setCreationDate(new Date());
        contract.setCurrentUserUniqueId(application.getStudent().getUniqueId());

        contractRepository.save(contract);
    }

    // PDF Generation --------------------------------

    @SneakyThrows
    public DownloadFileResponse generate(UUID uniqueId) {

        Contract contract = contractRepository.findById(uniqueId).get();
        ByteArrayOutputStream stream = new ByteArrayOutputStream();

        Document document = new Document();

        PdfWriter writer = PdfWriter.getInstance(document, stream);

        document.open();

        contractPdfGenerator.write(contract, document);

        document.close();
        byte[] data = stream.toByteArray();
        DownloadFileResponse response = new DownloadFileResponse();

        response.setName("Contrat");
        response.setType("application/pdf");
        response.setResource(new ByteArrayResource(data));
        response.setLength(data.length);

        return response;
    }

}

