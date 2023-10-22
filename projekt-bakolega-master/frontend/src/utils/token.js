

let token = null


const getKorisnikLocalStorage = () => {
    console.log(JSON.parse(window.localStorage.getItem("prijavljeniKorisnik")))
    return JSON.parse(window.localStorage.getItem("prijavljeniKorisnik"))
}

const postaviToken = (noviToken) => {
    if (noviToken == null) {
        token = null
    }
    else {
        token = `bearer ${noviToken}`
        console.log("token je postaviToken na:" + token)
    }

}

const getToken = () => {

    return token
}



export default { postaviToken, getToken, getKorisnikLocalStorage }