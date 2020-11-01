package cal.internshipmanager.service;

import cal.internshipmanager.model.User;
import cal.internshipmanager.repository.UserRepository;
import cal.internshipmanager.response.UserListReponse;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@SpringBootTest
public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Test
    public void studentUsers_validRequest() {

        // Arrange

        User user = new User();

        user.setUniqueId(UUID.randomUUID());
        user.setType(User.Type.STUDENT);
        user.setEmail("toto@gmail.com");
        user.setFirstName("Toto");
        user.setLastName("Tata");
        user.setCompany("Test");

        UserService userService = new UserService(userRepository);

        when(userRepository.findAllByType(User.Type.STUDENT))
                .thenReturn(List.of(user));

        // Act

        UserListReponse response = userService.students();

        // Assert

        for (UserListReponse.User user1 : response.getUsers()) {

            assertEquals(user.getUniqueId(), user1.getUniqueId());
            assertEquals(user.getType().toString(), user1.getType());
            assertEquals(user.getEmail(), user1.getEmail());
            assertEquals(user.getFirstName(), user1.getFirstName());
            assertEquals(user.getLastName(), user1.getLastName());
            assertEquals(user.getCompany(), user1.getCompany());

        }
    }

    @Test
    public void findUserById_validRequest(){

        // Arrange
        User user = new User();

        user.setUniqueId(UUID.randomUUID());
        user.setType(User.Type.EMPLOYER);
        user.setEmail("toto@gmail.com");
        user.setFirstName("Toto");
        user.setLastName("Tata");
        user.setCompany("Test");

        UserListReponse.User userToFind = UserListReponse.map(user);

        UserService userService = new UserService(userRepository);

        // Act
        when(userRepository.findById(any())).thenReturn(Optional.of(user));


        // Assert
        assertEquals(userToFind, userService.find(user.getUniqueId()));

    }


}
