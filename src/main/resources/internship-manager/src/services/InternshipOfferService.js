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
        return axios.post(Config.target + '/internshipoffer/create', request, headers());
    }

}

export default new AuthenticationService();