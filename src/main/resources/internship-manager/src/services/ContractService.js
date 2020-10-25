import axios from 'axios'
import { Config } from "../environment";

function downloadHeaders() {

    let token = localStorage.getItem("AccessToken");

    return {
        headers: {
            'Authorization': token
        },
        responseType: 'blob'
    }
}

function headers() {

    let token = localStorage.getItem("AccessToken");

    return {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        }
    }
}

class ContractService {

    //
    // Get
    //

    generate(request){
        return axios.get(Config.target + `/contract/internship-application/${request}`, downloadHeaders());
    }

}

export default new ContractService();