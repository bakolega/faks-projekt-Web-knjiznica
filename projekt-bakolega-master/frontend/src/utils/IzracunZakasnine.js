const Zakasnina = (datum) => {

    const date1 = new Date(datum);
    const date2 = new Date();
    const diffTime = Math.abs(date2 - date1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 0)
        return ("Zakasnina je " + diffDays + "dana")
    else
        return ("Nema zakasnine")
}

export default Zakasnina