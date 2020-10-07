package cal.internshipmanager.repository;

import cal.internshipmanager.model.InternshipOffer;
import cal.internshipmanager.model.PortfolioDocument;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface InternshipOfferRepository extends MongoRepository<InternshipOffer, UUID> {

    List<InternshipOffer> findAllByStatus(InternshipOffer.Status status);

}
