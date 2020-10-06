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

class PortfolioService {

    portfolioDocuments(request) {
        return axios.get(Config.target + `/portfolio/portfolio-documents/${request}`, headers());
    }

}

export default new PortfolioService();