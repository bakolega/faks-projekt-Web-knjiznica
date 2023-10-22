import axios from 'axios'
import TokenAkcije from '../utils/token'

const osnovniUrl = 'http://localhost:3001/api/autori'

const dohvatiSve = async () => {
    return await axios.get(osnovniUrl)
}

const addAutor = async noviObjekt => {
    const config = {
        headers: { Authorization: TokenAkcije.getToken() }
    }
    const noviAutor = await axios.post(osnovniUrl, noviObjekt, config)
    return (noviAutor.data)
}

const getAutorImenom = async (autor) => {
    const config = {
        headers: { Authorization: TokenAkcije.getToken() }
    }
    let res = await axios.post(`${osnovniUrl}/pretragaJednog`, autor, config);
    return res;
}


const getIdAutor = async (id) => {
    const config = {
        headers: { Authorization: TokenAkcije.getToken() }
    }
    let res = await axios.get(`${osnovniUrl}/${id}`, config);
    return res;
}


export default { dohvatiSve, addAutor, getIdAutor, getAutorImenom }