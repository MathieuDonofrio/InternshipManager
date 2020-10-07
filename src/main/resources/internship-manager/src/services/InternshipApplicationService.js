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

        console.log(request);

        return axios.post(Config.target + '/internship-application/create', request, headers());
    }

    internshipApplications(request){
        return axios.get(Config.target + `/internship-application/internship-applications/${request}`, headers());
    }

}

export default new InternshipApplicationService();