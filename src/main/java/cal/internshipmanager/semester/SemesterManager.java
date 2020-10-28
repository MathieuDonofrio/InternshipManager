package cal.internshipmanager.semester;

import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Component;

import java.io.*;
import java.util.Properties;

@Component
public class SemesterManager {

    //
    // Constants
    //

    private static final String SEMESTER_PROPERTIES_PATH = "semester.properties";

    //
    // State
    //

    private final File file;

    private final Properties properties;

    //
    // Constructors
    //

    @SneakyThrows
    @Autowired
    public SemesterManager(ResourceLoader resourceLoader) {
        file = new ClassPathResource(SEMESTER_PROPERTIES_PATH).getFile();
        properties = new Properties();

        properties.load(new FileInputStream(file));
    }

    //
    // Service
    //

    @SneakyThrows
    public void setCurrentSemester(final String semester) {
        properties.setProperty("current", semester);
        properties.store(new FileOutputStream(file), "Timestamp=" + System.currentTimeMillis());
    }

    public void setCurrentSemester(final Season season, final int year) {
        setCurrentSemester(formatSemester(season, year));
    }

    public String getCurrentSemester() {
        return properties.getProperty("current");
    }

    //
    // Utils
    //

    public static String formatSemester(final Season season, final int year) {
        return season + "-" + year;
    }

    //
    // Inner classes & Enums
    //

    enum Season {
        WINTER, AUTUMN, SUMMER
    }
}
