package cal.internshipmanager.controller;

import cal.internshipmanager.request.PortfolioDocumentDeleteRequest;
import cal.internshipmanager.response.PortfolioDocumentListResponse;
import cal.internshipmanager.service.PortfolioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
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

    @PreAuthorize("hasAuthority('STUDENT')")
    @PostMapping("upload")
    public void upload(@NotBlank @RequestParam("type") String type,
                       @NotNull @RequestParam("file") MultipartFile file) {
        portfolioService.upload(type, file);
    }

    @PreAuthorize("hasAuthority('STUDENT')")
    @PostMapping("delete")
    public void delete(@Valid @RequestBody PortfolioDocumentDeleteRequest request) {
        portfolioService.delete(request);
    }

    //
    // Get
    //

    @PreAuthorize("hasAuthority('STUDENT') || hasAnyAuthority('EMPLOYER')")
    @GetMapping("portfolio-documents/{userUniqueId}")
    public PortfolioDocumentListResponse portfolioDocuments(@PathVariable UUID userUniqueId) {
        return portfolioService.portfolioDocuments(userUniqueId);
    }

}
