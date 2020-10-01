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

    createInternshipOffer(request) {
        return axios.post(Config.target + '/internship-offer/create', request, headers());
    }

    getApprovedOffers(){
        return axios.get(Config.target + '/internship-offer/approved',headers());
    }

    getValidatedStudent(request){
        return axios.get(Config.target + '/internship-offer/users',request,headers())
    }

    removeUser(request){
        return axios.post(Config.target + '/internship-offer/remove-user', request, headers());
    }

    addUser(request){
        return axios.post(Config.target + '/internship-offer/add-user', request, headers());
    }

}

export default new InternshipOfferService();