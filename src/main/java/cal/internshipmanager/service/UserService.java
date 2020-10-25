package cal.internshipmanager.service;

import cal.internshipmanager.model.User;
import cal.internshipmanager.repository.UserRepository;
import cal.internshipmanager.response.UserListReponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
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

        List<User> students = userRepository.findAllByType("STUDENT");

        UserListReponse response = new UserListReponse();

        response.setUsers(students.stream().map(UserListReponse::map).collect(Collectors.toList()));

        return response;
    }

    public UserListReponse.User find(UUID userUniqueId){
        return UserListReponse.map(userRepository.findById(userUniqueId).get());
    }



}
