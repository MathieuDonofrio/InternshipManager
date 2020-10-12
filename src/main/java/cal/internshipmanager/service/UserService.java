package cal.internshipmanager.service;

import cal.internshipmanager.model.User;
import cal.internshipmanager.repository.UserRepository;
import cal.internshipmanager.response.UserListReponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import javax.validation.constraints.NotNull;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Validated
public class UserService {

    //
    // Dependencies
    //

    private final UserRepository userRepository;


    //
    // Constructors
    //

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    //
    // Services
    //

    public UserListReponse students() {
        //todo why is it called internshipoffers?
        List<User> internshipOffers = userRepository.findAllByType("STUDENT");

        UserListReponse response = new UserListReponse();

        response.setUsers(internshipOffers.stream().map(x ->
                UserListReponse.map(x)).collect(Collectors.toList()));

        return response;
    }

    public UserListReponse.User find(@NotNull UUID userId){
        return UserListReponse.map(userRepository.findById(userId).get());
    }



}
