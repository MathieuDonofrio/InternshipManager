package cal.internshipmanager.request;

import lombok.Data;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.List;

@Data
public class InternshipOfferCreationRequest implements Serializable {

    @NotBlank(message = "Company is mandatory")
    private String company;

    @NotBlank(message = "Job title is mandatory")
    private String jobTitle;

    @NotNull
    private List<String> jobScope;

    private long startDate;

    @Min(value = 1, message = "Duration must be at least 1 hour")
    private int duration;

    @Min(value = 0, message = "Salary must be at least 0.00$")
    private float salary;

    @Min(value = 1, message = "Hours must be at least 1 hour")
    private float hours;

}
