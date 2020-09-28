package cal.internshipmanager.repository;

import cal.internshipmanager.model.InternshipOffer;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.UUID;

public interface InternshipOfferRepository extends MongoRepository<InternshipOffer, UUID> {
}
