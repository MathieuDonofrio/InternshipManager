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

class InternshipOfferService {

    //
    // Post
    //

    create(request) {
        return axios.post(Config.target + '/internship-offer/create', request, headers());
    }

    approve(request){
        return axios.post(Config.target + '/internship-offer/approve', request ,headers());
    }

    reject(request){
        return axios.post(Config.target + '/internship-offer/reject', request, headers());
    }

    addUser(request){
        return axios.post(Config.target + '/internship-offer/add-user', request, headers());
    }

    removeUser(request){
        return axios.post(Config.target + '/internship-offer/remove-user', request, headers());
    }

    //
    // Get
    //

    pendingApproval(){
        return axios.get(Config.target + '/internship-offer/pending-approval', headers());
    }

    approved(){
        return axios.get(Config.target + '/internship-offer/approved', headers());
    }

    rejected(){
        return axios.get(Config.target + '/internship-offer/rejected', headers());
    }

    users(request){
        return axios.get(Config.target + `/internship-offer/users/${request}`, headers())
    }

    accessible(request){
        return axios.get(Config.target + `/internship-offer/accessible/${request}`, headers());
    }
    
    // TODO: move to user service
    getAllStudent(){ // WTF?
        return axios.get(Config.target + `/user/students`, headers())
    }

}

export default new InternshipOfferService();