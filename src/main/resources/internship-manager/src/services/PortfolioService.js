import axios from 'axios'
import { Config } from "../environment";


function uploadHeaders() {

    let token = localStorage.getItem("AccessToken");

    return {
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': token
        }
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

class PortfolioService {

    upload(request){
        let fd = new FormData();

        fd.append('type', request.type);
        fd.append('file', request.file);

        return axios.post(Config.target + '/portfolio/upload', fd, uploadHeaders());
    }

    download(request){
        return axios.get(Config.target + `/portfolio/${request}`, headers());
    }

    delete(request) {
        return axios.post(Config.target + '/portfolio/delete', request, headers());
    }
    
    portfolioDocuments(request) {
        return axios.get(Config.target + `/portfolio/portfolio-documents/${request}`, headers());
    }

}

export default new PortfolioService();