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

class SettingsService {



    // PUT

    semester(request){
        return axios.put(Config.target + `/settings/semester/${request}`, {}, headers());
    }

    // Get

    getSemester(){
        return axios.get(Config.target + '/settings/semester', headers());
    }

}

export default new SettingsService();