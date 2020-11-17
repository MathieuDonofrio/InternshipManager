package cal.internshipmanager.controller;

import cal.internshipmanager.response.ContractListResponse;
import cal.internshipmanager.response.DownloadFileResponse;
import cal.internshipmanager.service.ContractService;
import cal.internshipmanager.validator.ExistingContract;
import cal.internshipmanager.validator.ExistingInternshipApplication;
import cal.internshipmanager.validator.ExistingUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
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

    @GetMapping("awaiting-signature/{userUniqueId}")
    public ContractListResponse awaitingSignature(@Valid @PathVariable @ExistingUser UUID userUniqueId){
        return contractService.awaitingSignature(userUniqueId);
    }

    @GetMapping("internship-application/{uniqueId}") // TODO replace internship-application by generate
    public ResponseEntity<Resource> generate(@Valid @PathVariable @ExistingInternshipApplication UUID uniqueId) {
        return DownloadFileResponse.responseEntity(contractService.generate(uniqueId));
    }

    //
    // Put
    //

    @PutMapping("sign/{uniqueId}")
    public void semester(@Valid @PathVariable @ExistingContract UUID uniqueId) {
        contractService.sign(uniqueId);
    }


}
