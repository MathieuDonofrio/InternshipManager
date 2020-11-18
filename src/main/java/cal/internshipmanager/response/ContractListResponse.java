package cal.internshipmanager.response;

import lombok.Data;

import java.util.Date;
import java.util.List;
import java.util.UUID;

@Data
public class ContractListResponse {

    //
    // Fields
    //

    private List<Contract> contracts;

    //
    // Inner classes & Enums
    //

    @Data
    public static class Contract {

        private UUID uniqueId;

        private String semester;

        private String status;

        private InternshipApplicationListResponse.InternshipApplication application;

        private UserListReponse.User administrator;

        private long creationDate;

        private Signature studentSignature;

        private Signature employerSignature;

        private Signature administratorSignature;

        private UUID currentUserUniqueId;

    }

    @Data
    public static class Signature {

        private UUID uniqueId;

        private Date uploadDate;

    }

    //
    // Utils
    //

    public static Contract map(cal.internshipmanager.model.Contract from) {

        Contract contract = new Contract();

        contract.uniqueId = from.getUniqueId();
        contract.semester = from.getSemester();
        contract.status = from.getStatus().toString();
        contract.application = InternshipApplicationListResponse.map(from.getApplication());
        contract.administrator = UserListReponse.map(from.getAdministrator());
        contract.creationDate = from.getCreationDate().getTime();
        contract.studentSignature = map(from.getStudentSignature());
        contract.employerSignature = map(from.getEmployerSignature());
        contract.administratorSignature = map(from.getAdministratorSignature());
        contract.currentUserUniqueId = from.getCurrentUserUniqueId();

        return contract;
    }

    public static Signature map(cal.internshipmanager.model.Signature from){

        Signature signature = new Signature();

        signature.uniqueId = from.getUniqueId();
        signature.uploadDate = from.getUploadDate();

        return signature;
    }

}
