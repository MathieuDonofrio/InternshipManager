import { Box, Button, Container, CssBaseline, Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import ContractService from "../services/ContractService";
import InternshipApplicationService from "../services/InternshipApplicationService";
import InternshipOfferService from "../services/InternshipOfferService";

export default function Dashboard() {
    const history = useHistory();
    const [adminAppCount, setAdminAppCount] = useState(0);
    const [adminOfferCount, setAdminOfferCount] = useState(0);

    const [employerAppCount, setEmployerAppCount] = useState(0);
    const [studentAppliableCount, setStudentAppliableCount] = useState(0);

    const [contractCount, setContractCount] = useState(0);

    const fetchAdmin = () => {
        findAdminAwaitingApplicationsCount();
        findAwaitingOffersCount();
        findAllContractsAwaitingSignatureCount()
    }

    const fetchEmployer = () => {
        findEmployerAwaitingApplicationsCount();
        findAllContractsAwaitingSignatureCount()
    }

    const fetchStudent = () => {
        findAppliableoffersCount();
        findAllContractsAwaitingSignatureCount();
    }

    const conditionalFetch = () => {
        if (isAdministrator()) {
            fetchAdmin();
        } else if (isEmployer()) {
            fetchEmployer();
        } else fetchStudent();
    }

    //
    // Event handlers
    //

    const isEmployer = () => {
        return localStorage.getItem('UserType') === "EMPLOYER";
    }

    const isAdministrator = () => {
        return localStorage.getItem('UserType') === "ADMINISTRATOR";
    }

    const isStudent = () => {
        return localStorage.getItem('UserType') === "STUDENT";
    }

    //
    // Administrator
    //

    const findAdminAwaitingApplicationsCount = () => {
        InternshipApplicationService.pendingApproval().then(response => {
            setAdminAppCount(response.data.applications.length);
        });
    }

    const findAwaitingOffersCount = () => {
        InternshipOfferService.pendingApproval().then(response => {
            setAdminOfferCount(response.data.internshipOffers.length);
        });
    }

    //
    // Employer
    //

    const findEmployerAwaitingApplicationsCount = () => {

        let userId = localStorage.getItem("UserUniqueId");

        InternshipApplicationService.findAllApprovedByAllOffers(userId).then(response => {
            setEmployerAppCount(response.data.applications.length);
        });
    }

    //
    // Student
    //

    const findAppliableoffersCount = () => {

        let uuid = localStorage.getItem("UserUniqueId");

        InternshipOfferService.accessible(uuid).then(response1 => {

            InternshipApplicationService.internshipApplications(uuid).then(response2 => {
                const offers = response1.data.internshipOffers.filter(offer =>
                    !response2.data.applications.some(app => app.offerUniqueId == offer.uniqueId));

                setStudentAppliableCount(offers.length);
            });
        });

    }

    const findAllContractsAwaitingSignatureCount = () => {

        ContractService.awaitingSignature(localStorage.getItem('UserUniqueId')).then(response => {
            setContractCount(response.data.contracts.length);
        });

    }

    useEffect(() => { conditionalFetch(); }, [])

    //
    // Rendering
    //

    return (
        <div>

            <Table size="small">
                <TableHead>
                    <TableCell width="70%"></TableCell>
                    <TableCell width="30%"></TableCell>
                </TableHead>


                {isAdministrator() &&
                    <TableBody>
                        <TableRow key="contrats">
                            <TableCell align="left">Vous avez {contractCount} {contractCount > 1 ? 'contrats en attentes' : 'contrat en attente'} de signature</TableCell>
                            <TableCell align="right">
                                <Button variant="contained" color="secondary" size="small" onClick={() => history.push(`/contracts/`)}>
                                    go
                                            </Button>
                            </TableCell>
                        </TableRow>
                        <TableRow key="offers">
                            <TableCell align="left">Vous avez {adminOfferCount} {adminOfferCount > 1 ? 'offres en attentes' : 'offre en attente'} d'approbation</TableCell>
                            <TableCell align="right">
                                <Button variant="contained" color="secondary" size="small" onClick={() => history.push(`/internship-offers/`)}>
                                    go
                                            </Button>
                            </TableCell>
                        </TableRow>
                        <TableRow key="applications">
                            <TableCell align="left">Vous avez {adminAppCount} {adminAppCount > 1 ? 'applications en attentes' : 'application en attente'} d'approbation</TableCell>
                            <TableCell align="right">
                                <Button variant="contained" color="secondary" size="small" onClick={() => history.push(`/internship-applications/`)}>
                                    go
                                            </Button>
                            </TableCell>
                        </TableRow>

                    </TableBody>
                }

                {isEmployer() &&
                    <TableBody>
                        <TableRow key="contrats">
                            <TableCell align="left">Vous avez {contractCount} {contractCount > 1 ? 'contrats en attentes' : 'contrat en attente'} de signature</TableCell>
                            <TableCell align="right">
                                <Button variant="contained" color="secondary" size="small" onClick={() => history.push(`/contracts/`)}>
                                    go
                                            </Button>
                            </TableCell>
                        </TableRow>
                        <TableRow key="appliquant">
                            <TableCell align="left">Vous avez {employerAppCount} {employerAppCount > 1 ? 'applications en attentes' : 'application en attente'} d'approbation</TableCell>
                            <TableCell align="right">
                                <Button variant="contained" color="secondary" size="small" onClick={() => history.push(`/internship-applications/`)}>
                                    go
                                            </Button>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                }

                {isStudent() &&
                    <TableBody>
                        <TableRow key="contrats">
                            <TableCell align="left">Vous avez {contractCount} {contractCount > 1 ? 'contrats en attentes' : 'contrat en attente'} de signature</TableCell>
                            <TableCell align="right">
                                <Button variant="contained" color="secondary" size="small" onClick={() => history.push(`/contracts/`)}>
                                    go
                                            </Button>
                            </TableCell>
                        </TableRow>
                        <TableRow key="appliquable">
                            <TableCell align="left">Vous avez {studentAppliableCount} {studentAppliableCount > 1 ? 'offres de stages applicables' : 'offre de stage applicable'}</TableCell>
                            <TableCell align="right">
                                <Button variant="contained" color="secondary" size="small" onClick={() => history.push(`/internship-offers/`)}>
                                    go
                                            </Button>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                }


            </Table>
        </div>
    )
}