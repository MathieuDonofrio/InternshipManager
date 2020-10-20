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

    createInternshipApplication(request) {
        return axios.post(Config.target + '/internship-application/create', request, headers());
    }

    internshipApplications(request){
        return axios.get(Config.target + `/internship-application/internship-applications/${request}`, headers());
    }

    approve(request){
        return axios.put(Config.target + '/internship-application', request ,headers());
    }

    reject(request){
        return axios.put(Config.target + '/internship-application', request, headers());
    }

    getInternshipApplications(request){
        return axios.get(Config.target + `/internship-application/${request}`, headers());
    }

    getInternshipPendingApplications(){
        const request= "PENDING_APPROVAL";
        return axios.get(Config.target + `/internship-application/${request}`, headers());
    }
}

export default new InternshipApplicationService();