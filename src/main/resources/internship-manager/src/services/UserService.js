import axios from 'axios'
import { Config } from "../environment";


function headers() {

  let token = localStorage.getItem("AccessToken");

  return {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token,
    }
  }
}

class UserService {

  //
  // Get
  //

  students() {
    return axios.get(Config.target + '/user/students', headers());
  }

}

export default new UserService();