package cal.internshipmanager.controller;

import cal.internshipmanager.model.PortfolioDocument;
import cal.internshipmanager.request.PortfolioDocumentDeleteRequest;
import cal.internshipmanager.response.PortfolioDocumentListResponse;
import cal.internshipmanager.service.PortfolioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<Resource> download(@PathVariable UUID uniqueId) {
        PortfolioDocument portfolioDocument = portfolioService.download(uniqueId);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(portfolioDocument.getFileType()))
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + portfolioDocument.getFileName() + "\"")
                .body(new ByteArrayResource(portfolioDocument.getData()));
    }

    @GetMapping("portfolio-documents/{userUniqueId}")
    public PortfolioDocumentListResponse portfolioDocuments(@PathVariable UUID userUniqueId) {
        return portfolioService.portfolioDocuments(userUniqueId);
    }

}
