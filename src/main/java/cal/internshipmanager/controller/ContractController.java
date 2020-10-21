package cal.internshipmanager.controller;

import cal.internshipmanager.model.PortfolioDocument;
import cal.internshipmanager.service.AuthenticationService;
import cal.internshipmanager.service.ContractService;
import cal.internshipmanager.validator.ExistingInternshipApplication;
import cal.internshipmanager.validator.ExistingPortfolioDocument;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.Base64Utils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.UUID;

@RestController()
@RequestMapping("/contract")
public class ContractController {

    //
    // Dependencies
    //

    private final ContractService contractService;

    //
    // Constructors
    //

    @Autowired
    public ContractController(ContractService contractService) {
        this.contractService = contractService;
    }

    //
    // Get
    //

    @GetMapping("internship-application/{uniqueId}")
    public ResponseEntity<byte[]> generate(@Valid @PathVariable @ExistingInternshipApplication UUID uniqueId) {

        byte[] data = Base64Utils.encode(contractService.generate(uniqueId));

        HttpHeaders headers = new HttpHeaders();

        headers.setContentType(MediaType.parseMediaType("application/pdf"));
        headers.setContentLength(data.length);
        headers.set(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"Contrat\"");

        return ResponseEntity.ok().headers(headers).body(data);
    }

}
