package cal.internshipmanager.service;

import cal.internshipmanager.model.InternshipOffer;
import cal.internshipmanager.model.User;
import cal.internshipmanager.repository.InternshipOfferRepository;
import cal.internshipmanager.repository.UserRepository;
import cal.internshipmanager.request.*;
import cal.internshipmanager.response.InternshipOfferListResponse;
import cal.internshipmanager.response.UserListReponse;
import cal.internshipmanager.validator.ExistingInternshipOffer;
import cal.internshipmanager.validator.ExistingUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Validated
public class InternshipOfferService {

    //
    // Dependencies
    //

    private final InternshipOfferRepository internshipOfferRepository;

    private final UserRepository userRepository;

    //
    // Constructors
    //

    @Autowired
    public InternshipOfferService(InternshipOfferRepository internshipOfferRepository, UserRepository userRepository) {
        this.internshipOfferRepository = internshipOfferRepository;
        this.userRepository = userRepository;
    }

    //
    // Services
    //

    public void create(@Valid InternshipOfferCreationRequest request) {

        final Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        UUID userUniqueId = UUID.fromString((String) authentication.getPrincipal());

        InternshipOffer internshipOffer = new InternshipOffer();

        internshipOffer.setUniqueId(UUID.randomUUID());
        internshipOffer.setEmployer(userUniqueId);
        internshipOffer.setStatus(InternshipOffer.Status.PENDING_APPROVAL);
        internshipOffer.setCompany(request.getCompany());
        internshipOffer.setDuration(request.getDuration());
        internshipOffer.setHours(request.getHours());
        internshipOffer.setJobScope(request.getJobScope());
        internshipOffer.setJobTitle(request.getJobTitle());
        internshipOffer.setSalary(request.getSalary());
        internshipOffer.setStartDate(new Date(request.getStartDate()));
        internshipOffer.setUsers(new ArrayList<>());

        internshipOfferRepository.save(internshipOffer);
    }

    public void approve(@Valid InternshipOfferApproveRequest request) {

        InternshipOffer internshipOffer = internshipOfferRepository.findById(request.getUniqueId()).orElse(null);

        internshipOffer.setStatus(InternshipOffer.Status.APPROVED);

        internshipOfferRepository.save(internshipOffer);
    }

    public void reject(@Valid InternshipOfferRejectRequest request) {

        InternshipOffer internshipOffer = internshipOfferRepository.findById(request.getUniqueId()).orElse(null);

        internshipOffer.setStatus(InternshipOffer.Status.REJECTED);

        internshipOfferRepository.save(internshipOffer);
    }

    public InternshipOfferListResponse pendingApproval() {

        List<InternshipOffer> internshipOffers = internshipOfferRepository.findAllByStatus(
                InternshipOffer.Status.PENDING_APPROVAL);

        InternshipOfferListResponse response = new InternshipOfferListResponse();

        response.setInternshipOffers(internshipOffers.stream().map(x ->
                InternshipOfferListResponse.map(x)).collect(Collectors.toList()));

        return response;
    }

    public InternshipOfferListResponse approved() {

        List<InternshipOffer> internshipOffers = internshipOfferRepository.findAllByStatus(
                InternshipOffer.Status.APPROVED);

        InternshipOfferListResponse response = new InternshipOfferListResponse();

        response.setInternshipOffers(internshipOffers.stream().map(x ->
                InternshipOfferListResponse.map(x)).collect(Collectors.toList()));

        return response;
    }

    public InternshipOfferListResponse rejected() {

        List<InternshipOffer> internshipOffers = internshipOfferRepository.findAllByStatus(
                InternshipOffer.Status.REJECTED);

        InternshipOfferListResponse response = new InternshipOfferListResponse();

        response.setInternshipOffers(internshipOffers.stream().map(x ->
                InternshipOfferListResponse.map(x)).collect(Collectors.toList()));

        return response;
    }

    public InternshipOfferListResponse accessible(@Valid @ExistingUser UUID userUniqueId) {

        List<InternshipOffer> internshipOffers = internshipOfferRepository.findAllByStatus(
                InternshipOffer.Status.APPROVED);

        InternshipOfferListResponse response = new InternshipOfferListResponse();

        response.setInternshipOffers(internshipOffers.stream()
                .filter(x -> x.getUsers().stream().filter(y -> y.getUniqueId().equals(userUniqueId)).count() > 0)
                .map(x -> InternshipOfferListResponse.map(x)).collect(Collectors.toList()));

        return response;
    }

    public UserListReponse users(@Valid @ExistingInternshipOffer UUID uniqueId) {

        InternshipOffer internshipOffer = internshipOfferRepository.findById(uniqueId).orElse(null);

        UserListReponse response = new UserListReponse();

        response.setUsers(internshipOffer.getUsers().stream().map(x ->
                UserListReponse.map(x)).collect(Collectors.toList()));

        return response;
    }

    public void addUser(@Valid InternshipOfferAddUserRequest request) {

        InternshipOffer internshipOffer = internshipOfferRepository.findById(
                request.getOfferUniqueId()).orElse(null);

        User user = userRepository.findById(request.getUserUniqueId()).orElse(null);

        internshipOffer.getUsers().add(user);

        internshipOfferRepository.save(internshipOffer);
    }

    public void removeUser(@Valid InternshipOfferRemoveUserRequest request) {

        InternshipOffer internshipOffer = internshipOfferRepository.findById(
                request.getOfferUniqueId()).orElse(null);

        User user = userRepository.findById(request.getUserUniqueId()).orElse(null);
        internshipOffer.getUsers().remove(user);

        internshipOfferRepository.save(internshipOffer);
    }

    public InternshipOfferListResponse findAllByEmployer(@NotNull UUID uniqueId){

        List<InternshipOffer> internshipOffers = internshipOfferRepository.findAllByEmployerAndStatus(uniqueId, InternshipOffer.Status.APPROVED);

        InternshipOfferListResponse response = new InternshipOfferListResponse();

        response.setInternshipOffers(internshipOffers.stream().map(x ->
                InternshipOfferListResponse.map(x)).collect(Collectors.toList()));

        return response;
    }

}
