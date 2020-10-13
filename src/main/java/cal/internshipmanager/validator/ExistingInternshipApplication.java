package cal.internshipmanager.validator;

import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.METHOD, ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = ExistingInternshipApplicationValidator.class)
public @interface ExistingInternshipApplication {

    String message() default "Internship application does not exist";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};

}
