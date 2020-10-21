package cal.internshipmanager.controller;

import cal.internshipmanager.model.PortfolioDocument;
import cal.internshipmanager.request.PortfolioDocumentDeleteRequest;
import cal.internshipmanager.response.PortfolioDocumentListResponse;
import cal.internshipmanager.service.PortfolioService;
import cal.internshipmanager.validator.ExistingPortfolioDocument;
import cal.internshipmanager.validator.ExistingUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.Base64Utils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.UUID;

@RestController
@RequestMapping("/portfolio")
public class PortfolioController {

    //
    // Dependencies
    //

    private final PortfolioService portfolioService;

    //
    // Constructors
    //

    @Autowired
    public PortfolioController(PortfolioService portfolioService) {
        this.portfolioService = portfolioService;
    }

    //
    // Post
    //

    @PostMapping("upload")
    public void upload(@NotBlank @RequestParam("type") String type,
                       @NotNull @RequestParam("file") MultipartFile file) {
        portfolioService.upload(type, file);
    }

    @PostMapping("delete")
    public void delete(@Valid @RequestBody PortfolioDocumentDeleteRequest request) {
        portfolioService.delete(request);
    }

    //
    // Get
    //

    @GetMapping("{uniqueId}")
    public ResponseEntity<byte[]> download(@Valid @PathVariable @ExistingPortfolioDocument UUID uniqueId) {

        PortfolioDocument portfolioDocument = portfolioService.download(uniqueId);

        byte[] data = Base64Utils.encode(portfolioDocument.getData());

        HttpHeaders headers = new HttpHeaders();

        headers.setContentType(MediaType.parseMediaType(portfolioDocument.getFileType()));
        headers.setContentLength(data.length);
        headers.set(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + portfolioDocument.getFileName() + "\"");

        return ResponseEntity.ok().headers(headers).body(data);
    }

    @GetMapping("portfolio-documents/{userUniqueId}")
    public PortfolioDocumentListResponse portfolioDocuments(@Valid @PathVariable @ExistingUser UUID userUniqueId) {
        return portfolioService.portfolioDocuments(userUniqueId);
    }

}
