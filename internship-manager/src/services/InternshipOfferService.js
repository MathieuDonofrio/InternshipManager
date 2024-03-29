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

    //
    // Put
    //

    approve(request) {
        return axios.put(Config.target + `/internship-offer/approve/${request}`, {}, headers());
    }

    reject(request) {
        return axios.put(Config.target + `/internship-offer/reject/${request}`, {}, headers());
    }

    addUser(request) {
        return axios.put(Config.target + '/internship-offer/add-user', request, headers());
    }

    removeUser(request) {
        return axios.put(Config.target + '/internship-offer/remove-user', request, headers());
    }

    //
    // Get
    //

    find(request) {
        return axios.get(Config.target + `/internship-offer/${request}`, headers());
    }

    pendingApproval() {
        return axios.get(Config.target + '/internship-offer/pending-approval', headers());
    }

    approved() {
        return axios.get(Config.target + '/internship-offer/approved', headers());
    }

    rejected() {
        return axios.get(Config.target + '/internship-offer/rejected', headers());
    }

    accessible(request) {
        return axios.get(Config.target + `/internship-offer/accessible/${request}`, headers());
    }

    users(request) {
        return axios.get(Config.target + `/internship-offer/users/${request}`, headers())
    }

    findAllByEmployer(request) {
        return axios.get(Config.target + '/internship-offer/employer/' + request, headers());
    }

    findAllPendingByEmployer(request){
        return axios.get(Config.target + '/internship-offer/employer/pending/' + request, headers());
    }
    
    findAllRejectedByEmployer(request){
        return axios.get(Config.target + '/internship-offer/employer/rejected/' + request, headers());
    }



}

export default new InternshipOfferService();