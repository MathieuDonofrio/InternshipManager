package cal.internshipmanager.repository;

import cal.internshipmanager.model.Contract;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ContractRepository extends MongoRepository<Contract, UUID> {

    List<Contract> findAllBySemester(String semester);

    List<Contract> findAllBySemesterAndStatus(String semester, Contract.Status status);

    List<Contract> findAllBySemesterAndApplicationUniqueId(String semester, UUID applicationUniqueId);

    List<Contract> findAllBySemesterAndCurrentUserUniqueId(String semester, UUID currentUserUniqueId);

    List<Contract> findAllBySemesterAndAdministrator_UniqueId(String semester, UUID uniqueId);

    List<Contract> findAllBySemesterAndApplication_Student_UniqueId(String semester,UUID uniqueId);

    List<Contract> findAllBySemesterAndApplication_Offer_Employer(String semester,UUID uniqueId);
}