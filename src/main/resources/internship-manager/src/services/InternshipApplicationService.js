import axios from 'axios'
import { Config } from "../environment";

function headers() {

    let token = localStorage.getItem("AccessToken");

    return {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        }
    }
}

class InternshipApplicationService {

    //
    // Get
    //

    find(request) {
        return axios.get(Config.target + `/internship-application/${request}`, headers());
    }

    internshipApplications(request){
        return axios.get(Config.target + `/internship-application/internship-applications/${request}`, headers());
    }

    pendingApproval(){
        return axios.get(Config.target + `/internship-application/status/PENDING_APPROVAL`, headers());
    }

    approved(){
        return axios.get(Config.target + `/internship-application/status/APPROVED`, headers());
    }

    rejected(){
        return axios.get(Config.target + `/internship-application/status/REJECTED`, headers());
    }

    selected(){
        return axios.get(Config.target + `/internship-application/status/SELECTED`, headers());
    }

    findByOffer(request){
        return axios.get(Config.target + `/internship-application/offer/${request}`, headers());
    }

    findAllSelectedByAllOffers(request){
        return axios.get(Config.target + `/internship-application/offer/selected/${request}`, headers());
    }

    findAllApprovedByAllOffers(request){
        return axios.get(Config.target + `/internship-application/offer/approved/${request}`, headers());
    }

    applicationDocuments(request){
        return axios.get(Config.target + `/internship-application/documents/${request}`, headers());
    }

    //
    // Put
    //

    approve(request){
        return axios.put(Config.target + `/internship-application/approve/${request}`, {}, headers());
    }

    reject(request){
        return axios.put(Config.target + `/internship-application/reject/${request}`, {}, headers());
    }

    select(request){
        return axios.put(Config.target + `/internship-application/select/${request}`, {}, headers());
    }

    addInterview(request,date){
        return axios.put(Config.target + `/internship-application/interview/${request}`, {interviewDate: date}, headers());
    }

    //
    // Post
    //

    createInternshipApplication(request) {
        return axios.post(Config.target + '/internship-application/create', request, headers());
    }
    
}

export default new InternshipApplicationService();