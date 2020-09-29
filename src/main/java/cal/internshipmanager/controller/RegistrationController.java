package cal.internshipmanager.controller;

import cal.internshipmanager.request.EmployerRegistrationRequest;
import cal.internshipmanager.request.StudentRegistrationRequest;
import cal.internshipmanager.response.RegistrationResponse;
import cal.internshipmanager.service.RegistrationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

@RestController
@RequestMapping("/registration")
public class RegistrationController {

    //
    // Dependencies
    //

    private final RegistrationService registrationService;

    //
    // Constructors
    //

    @Autowired
    public RegistrationController(RegistrationService registrationService){
        this.registrationService = registrationService;
    }

    //
    // Services
    //

    @PostMapping("student")
    public RegistrationResponse registerStudent(@Valid @RequestBody StudentRegistrationRequest request) {
        return registrationService.registerStudent(request);
    }

    @PostMapping("employer")
    public RegistrationResponse registerEmployer(@Valid @RequestBody EmployerRegistrationRequest request) {
        return registrationService.registerEmployer(request);
    }

}
