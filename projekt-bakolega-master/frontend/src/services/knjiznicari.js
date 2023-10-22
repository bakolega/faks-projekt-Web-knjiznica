import axios from 'axios'
import TokenAkcije from '../utils/token'

const osnovniUrl = 'http://localhost:3001/api/knjiznicari'

const posudba = async (username, kopijaId) => {
    const config = {
        headers: { Authorization: TokenAkcije.getToken() }
    }
    const odgovor = await axios.patch(`${osnovniUrl}/posudba`, { username: username, kopijaId: kopijaId }, config)
    return odgovor.data
}

const povrat = async (username, kopijaId) => {
    const config = {
        headers: { Authorization: TokenAkcije.getToken() }
    }
    const odgovor = await axios.patch(`${osnovniUrl}/povrat`, { username: username, kopijaId: kopijaId }, config)
    return odgovor.data
}


export default { posudba, povrat}