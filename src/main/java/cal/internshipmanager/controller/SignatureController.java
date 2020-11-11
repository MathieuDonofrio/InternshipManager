package cal.internshipmanager.controller;

import cal.internshipmanager.response.DownloadFileResponse;
import cal.internshipmanager.service.SignatureService;
import cal.internshipmanager.validator.ExistingUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import java.util.UUID;

@RestController
@RequestMapping("/signature")
public class SignatureController {

    //
    // Dependencies
    //

    private final SignatureService signatureService;

    //
    // Constructors
    //

    @Autowired
    public SignatureController(SignatureService signatureService) {
        this.signatureService = signatureService;
    }

    //
    // Post
    //

    @PostMapping("upload")
    public void upload(@Valid @NotBlank @RequestParam("file") MultipartFile file) {
        signatureService.upload(file);
    }

    //
    // Get
    //

    @GetMapping("{uniqueId}")
    public ResponseEntity<Resource> download(@Valid @ExistingUser @PathVariable UUID uniqueId) {
        return DownloadFileResponse.responseEntity(signatureService.download(uniqueId));
    }

    //
    // Delete
    //

    @DeleteMapping("{uniqueId}")
    public void delete(@Valid @ExistingUser @PathVariable UUID uniqueId) {
        signatureService.delete(uniqueId);
    }
    
}
