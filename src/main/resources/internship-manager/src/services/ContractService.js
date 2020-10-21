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

class ContractService {

    generate(request){
        return axios.get(Config.target + `/contract/internship-application/${request}`, headers());
    }

}

export default new ContractService();