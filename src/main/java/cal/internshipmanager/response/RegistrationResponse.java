package cal.internshipmanager.response;

import lombok.Data;

import java.io.Serializable;
import java.util.UUID;

@Data
public class RegistrationResponse implements Serializable {

    /**
     * Associated newly registered user unique id
     */
    private UUID userUniqueId;

}
