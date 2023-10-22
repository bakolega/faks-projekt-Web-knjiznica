import axios from 'axios'
import TokenAkcije from '../utils/token'


const osnovniUrl = 'http://localhost:3001/api/korisnici'

const registracija = async podaci => {
    const config = {
        headers: { Authorization: TokenAkcije.getToken() }
    }

    console.log(podaci)
    const odgovor = await axios.post(osnovniUrl, podaci, config)
    return odgovor.data
}




export default { registracija }