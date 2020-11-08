package cal.internshipmanager.controller;

import cal.internshipmanager.response.DownloadFileResponse;
import cal.internshipmanager.service.ContractService;
import cal.internshipmanager.validator.ExistingInternshipApplication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.UUID;

@RestController
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
    public ResponseEntity<Resource> generate(@Valid @PathVariable @ExistingInternshipApplication UUID uniqueId) {
        return DownloadFileResponse.responseEntity(contractService.generate(uniqueId));
    }

}
