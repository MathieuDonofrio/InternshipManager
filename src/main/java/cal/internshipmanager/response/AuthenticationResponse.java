package cal.internshipmanager.response;

import lombok.Data;

import java.util.UUID;

@Data
public class AuthenticationResponse {

    //
    // Fields
    //

    private UUID userUniqueId;

    private String userType;

    private String token;

}
