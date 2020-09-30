package cal.internshipmanager.controller;

import cal.internshipmanager.request.InternshipOfferCreationRequest;
import cal.internshipmanager.response.UserListReponse;
import cal.internshipmanager.service.InternshipOfferService;
import cal.internshipmanager.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping("/user")
public class UserController {

    //
    // Dependencies
    //

    private final UserService userService;

    //
    // Constructors
    //

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    //
    // Get
    //

    @GetMapping("students")
    public UserListReponse studentUsers() {
        return userService.studentUsers();
    }

}
