const mongoose = require('mongoose')

const kopijaSchema = new mongoose.Schema({
    knjiga: { type: mongoose.Schema.Types.ObjectId, ref: "Knjiga", required: true },
    status: {
        type: String,
        required: true,
        enum: ["Dostupno", "Rad u knjižnici", "Posuđeno", "Rezervirano"],
        default: "Dostupno",
    },
    povrat: { type: Date, default: Date.now },
    brProduzenja: {
        type: Number,
        default: 0,
        required: true,
        max: 2,
    }
})

kopijaSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = doc._id.toString()
        delete ret._id
        delete ret.__v
        return ret
    }
})

const Kopija = mongoose.model('Kopija', kopijaSchema, 'kopije')

module.exports = Kopija
