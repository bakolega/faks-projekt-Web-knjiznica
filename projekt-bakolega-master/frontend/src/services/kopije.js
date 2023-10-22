import axios from 'axios'
import tokenAkcije from '../utils/token'

const osnovniUrl = 'http://localhost:3001/api/kopije'


const addKopija = async knjigaId => {
    const config = {
        headers: { Authorization: tokenAkcije.getToken() }
    }
    return (await axios.post(osnovniUrl, knjigaId, config)).data
}

const deleteKopija = async kopijaId => {
    const config = {
        headers: { Authorization: tokenAkcije.getToken() }
    }
    return (await axios.delete(`${osnovniUrl}/${kopijaId}`, config)).data
}

/*
{
    "povrat": "2023-06-13T16:53:26.378Z",
    "korisnik": {
        "username": "Admin",
        "ime": "Admin",
        "posudbe": [],
        "rezervacije": [],
        "isKnjiznicar": false,
        "id": "64862f364a37eeb0aee4eec2"
    }
}
*/
const getPosudbuKopije = async kopijaId => {
    const config = {
        headers: { Authorization: tokenAkcije.getToken() }
    }
    const temp = await axios.get(`${osnovniUrl}/${kopijaId}`, config)
    //console.log(temp.data)
    return temp.data

}

const getKopijeByKnjigaID = async knjigaId => {

    try {
        return await axios.get(`${osnovniUrl}/Sve/${knjigaId}`)
    } catch {
        return ("Greška")
    }
}

export default { addKopija, getKopijeByKnjigaID, getPosudbuKopije,deleteKopija }