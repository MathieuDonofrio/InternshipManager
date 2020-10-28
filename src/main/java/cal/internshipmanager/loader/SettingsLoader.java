package cal.internshipmanager.loader;

import cal.internshipmanager.model.Settings;
import cal.internshipmanager.repository.SettingsRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class SettingsLoader implements CommandLineRunner {

    //
    // Dependencies
    //

    private final SettingsRepository settingsRepository;

    //
    // Constructors
    //

    public SettingsLoader(SettingsRepository settingsRepository){
        this.settingsRepository = settingsRepository;
    }

    //
    // Services
    //

    @Override
    public void run(String... args) {

        List<Settings> result = settingsRepository.findAll();

        if(result.isEmpty()){

            Settings settings = new Settings();

            settings.setSemester("WINTER-2021");

            settingsRepository.save(settings);
        }
    }
}
