package cal.internshipmanager.model;

import lombok.Data;

import java.io.Serializable;
import java.util.Date;

@Data
public class Notification implements Serializable {

    private Date date;

    private String type;

    private String message;
}
