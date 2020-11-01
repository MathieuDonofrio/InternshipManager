package cal.internshipmanager.controller;

import cal.internshipmanager.service.SettingsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;

@RestController
@RequestMapping("/settings")
public class SettingsController {

    //
    // Dependencies
    //

    private final SettingsService settingsService;

    //
    // Constructors
    //

    @Autowired
    public SettingsController(SettingsService settingsService) {
        this.settingsService = settingsService;
    }

    //
    // Get
    //

    @GetMapping("semester")
    public String semester() {
        return settingsService.getSemester();
    }

    //
    // Put
    //

    @PutMapping("semester/{semester}")
    public void semester(@Valid @NotBlank @PathVariable String semester) {
        settingsService.setSemester(semester);
    }

}
