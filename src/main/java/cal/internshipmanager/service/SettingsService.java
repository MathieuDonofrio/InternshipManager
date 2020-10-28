package cal.internshipmanager.service;

import cal.internshipmanager.model.Settings;
import cal.internshipmanager.repository.SettingsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SettingsService {

    //
    // Dependencies
    //

    private final SettingsRepository settingsRepository;

    //
    // Constructors
    //

    @Autowired
    public SettingsService(SettingsRepository settingsRepository) {
        this.settingsRepository = settingsRepository;
    }

    //
    // Private Method
    //

    private Settings findSettings(){

        final List<Settings> settings = settingsRepository.findAll();

        if(settings == null || settings.size() != 1)
            throw new IllegalStateException("No settings could be found!");

        return settings.get(0);
    }

    //
    // Services
    //

    public void setSemester(String semester){

        final Settings settings = findSettings();

        settings.setSemester(semester);

        settingsRepository.save(settings);
    }

    public String getSemester(){

        final Settings settings = findSettings();

        return settings.getSemester();
    }
}
