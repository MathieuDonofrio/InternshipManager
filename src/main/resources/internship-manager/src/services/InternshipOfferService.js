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

class AuthenticationService {

    createInternshipOffer(request) {
        return axios.post(Config.target + '/internship-offer/create', request, headers());
    }

    pendingApproval(){
        return axios.get(Config.target + '/internship-offer/pending-approval', headers());
    }

    approve(request){
        return axios.post(Config.target + '/internship-offer/approve', request ,headers());
    }

    reject(request){
        return axios.post(Config.target + '/internship-offer/reject', request ,headers());
    }


}

export default new AuthenticationService();