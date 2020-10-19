package cal.internshipmanager.repository;

import cal.internshipmanager.model.InternshipApplication;
import cal.internshipmanager.model.InternshipOffer;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface InternshipApplicationRepository extends MongoRepository<InternshipApplication, UUID> {

    List<InternshipApplication> findAllByStudentUniqueId(UUID studentUniqueId);

    List<InternshipApplication> findAllByStatus(InternshipApplication.Status status);

    List<InternshipApplication> findAllByOfferUniqueId(UUID offerUniqueId);

}
