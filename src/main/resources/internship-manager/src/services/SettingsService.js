import axios from 'axios'
import { Config } from "../environment";

const headers = {
  'Content-Type': 'application/json'
}

class SettingsService {



    // PUT

    semester(request){
        return axios.put(Config.target + `/settings/semester/${request}`, {}, headers());
    }

}

export default new SettingsService();