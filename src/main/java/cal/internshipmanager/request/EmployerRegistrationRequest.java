package cal.internshipmanager.request;

import cal.internshipmanager.validator.UnregisteredEmail;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.io.Serializable;

@Data
public class EmployerRegistrationRequest implements Serializable {

    /**
     * E-mail
     */
    @NotBlank
    @UnregisteredEmail(message = "Email already in use")
    private String email;

    /**
     * Password
     */
    @NotBlank
    @Size(min = 6, max = 18, message = "Password size must be between 6 and 18")
    private String password;

    /**
     * First name
     */
    @NotBlank(message = "First name is mandatory")
    private String firstName;

    /**
     * Last name
     */
    @NotBlank(message = "First name is mandatory")
    private String lastName;

    /**
     * Company
     */
    @NotBlank(message = "Company is mandatory")
    private String company;
}
