package cal.internshipmanager.controller;

import cal.internshipmanager.response.DownloadFileResponse;
import cal.internshipmanager.service.SignatureService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;

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

    @GetMapping
    public ResponseEntity<Resource> download() {
        return DownloadFileResponse.responseEntity(signatureService.download());
    }
    
}
