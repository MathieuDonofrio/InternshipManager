package cal.internshipmanager.repository;

import cal.internshipmanager.model.InternshipApplication;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface InternshipApplicationRepository extends MongoRepository<InternshipApplication, UUID> {
}
