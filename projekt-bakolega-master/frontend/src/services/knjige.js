import axios from 'axios'
import autoriAkcije from './autori'
import TokenAkcije from '../utils/token'


const osnovniUrl = 'http://localhost:3001/api/knjige'

const dohvatiSve = async () => {
    const odgovor = await axios.get(osnovniUrl)
    return odgovor
}

const pretrazi = async (searchstring) => {

    return await axios.get(`${osnovniUrl}/pretraga/${searchstring}`)

}

const addKnjiga = async noviObjekt => {
    const config = {
        headers: { Authorization: TokenAkcije.getToken() }
    }

    const autor = (await autoriAkcije.getAutorImenom(noviObjekt.autor)).data
    if (autor != null) {

        noviObjekt.autorID = autor.id
        console.log(noviObjekt)
        return await axios.post(osnovniUrl, noviObjekt, config)

    } else {
        return ("Nepostojeci autor")
    }
}

const getIdKnjiga = async (id) => {
    let res = await axios.get(`${osnovniUrl}/${id}`);
    return res;
}


export default { dohvatiSve, addKnjiga, getIdKnjiga, pretrazi }