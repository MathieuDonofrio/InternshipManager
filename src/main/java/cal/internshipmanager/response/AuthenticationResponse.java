package cal.internshipmanager.response;

import lombok.Data;

import java.util.UUID;

@Data
public class AuthenticationResponse {

    /**
     * Associated authenticated user unique id
     * <p>
     * Redundant but allows for easier retrieval.
     */
    private UUID userUniqueId;

    /**
     * Associated authenticated user type
     * <p>
     * Redundant but allows for easier retrieval.
     */
    private String userType;

    /**
     * Generated jwt authentication token
     */
    private String token;


}
