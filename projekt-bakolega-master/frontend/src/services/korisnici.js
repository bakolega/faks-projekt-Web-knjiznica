import axios from 'axios'
import TokenAkcije from '../utils/token'

const osnovniUrl = 'http://localhost:3001/api/korisnici'

//Sve posuđeno
const getAllPosudbe = async (id) => {
    const config = {
        headers: { Authorization: TokenAkcije.getToken() }
    }
    let odgovor = (await axios.get(`${osnovniUrl}/${id}/posudbe`, config)).data
    return odgovor
}

const produziPosudbu = async (korsnikId,kopijaId) => {
    const config = {
        headers: { Authorization: TokenAkcije.getToken() }
    }
    return (await axios.patch(`${osnovniUrl}/${korsnikId}/posudbe`, {kopijaId}, config)).data
}

//Sve rezervacije
const getRezervacije = async id => {

    const config = {
        headers: { Authorization: TokenAkcije.getToken() }
    }
    let korisnik = (await axios.get(`${osnovniUrl}/${id}/rezervacije`, config)).data
    return korisnik
}
//Sve rezervacije detalji
const getRezervacijeInfo = async id => {

    const config = {
        headers: { Authorization: TokenAkcije.getToken() }
    }
    let korisnik = (await axios.get(`${osnovniUrl}/${id}/rezervacije/detalji`, config)).data
    return korisnik.rezervacije
}

const rezerviraj = async (korisnikId, kopijaId) => {
    const config = {
        headers: { Authorization: TokenAkcije.getToken() }
    }
    const odgovor = await axios.post(`${osnovniUrl}/${korisnikId}/rezervacije`, { kopijaId: kopijaId }, config)
    return odgovor.data
}

const otkaziRezervaciju = async (korisnikId, kopijaId) => {
    const config = {
        headers: { Authorization: TokenAkcije.getToken() }
    }
    const odgovor = await axios.patch(`${osnovniUrl}/${korisnikId}/rezervacije`, { kopijaId: kopijaId }, config)
    return odgovor.data
}

//Svi korisnici bez knjižnicara
const getAllKorisnike = async () => {
    const config = {
        headers: { Authorization: TokenAkcije.getToken() }
    }
    let odgovor = (await axios.get(osnovniUrl, config)).data
    return odgovor
}


//Uplata clanarine
const uplatiClanarinu = async (korisnikId,noviRok) => {
    const config = {
        headers: { Authorization: TokenAkcije.getToken() }
    }
    let odgovor = (await axios.patch(`${osnovniUrl}/${korisnikId}/clanarina`,{noviRok}, config)).data
    return odgovor
}

//Get clanarinu
const getClanarina = async (korisnikId) => {
    const config = {
        headers: { Authorization: TokenAkcije.getToken() }
    }
    let odgovor = (await axios.get(`${osnovniUrl}/${korisnikId}/clanarina`, config)).data
    return odgovor
}
export default { getRezervacije, rezerviraj, otkaziRezervaciju, getAllKorisnike, getAllPosudbe, getRezervacijeInfo, produziPosudbu,uplatiClanarinu, getClanarina}