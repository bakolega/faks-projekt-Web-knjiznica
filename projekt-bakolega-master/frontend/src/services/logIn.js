import axios from 'axios'


const osnovniUrl = 'http://localhost:3001/api/logIn'

const logIn = async podaci => {
    const odgovor = await axios.post(osnovniUrl, podaci)
    return odgovor.data
}




export default { logIn }