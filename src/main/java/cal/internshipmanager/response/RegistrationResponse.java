package cal.internshipmanager.response;

import lombok.Data;

import java.io.Serializable;
import java.util.UUID;

@Data
public class RegistrationResponse implements Serializable {

    private UUID userUniqueId;

}
