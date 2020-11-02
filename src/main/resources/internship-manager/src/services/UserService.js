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

  studentsWithApplication() {
    return axios.get(Config.target + '/user/students-with-application', headers());
  }

  studentsWithoutApplication() {
    return axios.get(Config.target + '/user/students-without-application', headers());
  }

}

export default new UserService();