package cal.internshipmanager.service;

import cal.internshipmanager.model.User;
import cal.internshipmanager.repository.InternshipApplicationRepository;
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

    private final InternshipApplicationRepository internshipApplicationRepository;

    private final SettingsService settingsService;


    //
    // Constructors
    //

    @Autowired
    public UserService(UserRepository userRepository, InternshipApplicationRepository internshipApplicationRepository,SettingsService settingsService) {
        this.userRepository = userRepository;
        this.internshipApplicationRepository = internshipApplicationRepository;
        this.settingsService = settingsService;
    }

    //
    // Services
    //

    public UserListReponse students() {

        List<User> students = userRepository.findAllByType(User.Type.STUDENT);

        UserListReponse response = new UserListReponse();

        response.setUsers(students.stream().map(UserListReponse::map).collect(Collectors.toList()));

        return response;
    }

    public UserListReponse studentsWithApplication(){
        List<User> students = userRepository.findAllByType(User.Type.STUDENT);

        UserListReponse response = new UserListReponse();

        response.setUsers(students
                .stream()
                .filter(x -> !internshipApplicationRepository.findAllByStudentUniqueIdAndSemester(x.getUniqueId(),settingsService.getSemester()).isEmpty())
                .map(UserListReponse::map)
                .collect(Collectors.toList()));

        return response;
    }

    public UserListReponse studentsWithoutApplication(){
        List<User> students = userRepository.findAllByType(User.Type.STUDENT);

        UserListReponse response = new UserListReponse();

        response.setUsers(students
                .stream()
                .filter(x -> internshipApplicationRepository.findAllByStudentUniqueIdAndSemester(x.getUniqueId(),settingsService.getSemester()).isEmpty())
                .map(UserListReponse::map)
                .collect(Collectors.toList()));

        return response;
    }

    public UserListReponse.User find(UUID userUniqueId){
        return UserListReponse.map(userRepository.findById(userUniqueId).get());
    }



}
