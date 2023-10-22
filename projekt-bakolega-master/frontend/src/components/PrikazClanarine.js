const PrikazClanarine = (props) => {

    console.log("clanarina")

    const rok = new Date(props.clanariaRok)

    return (
        <span>  Clanarina istece: {rok.toDateString()}</span>
    )
}

export default PrikazClanarine