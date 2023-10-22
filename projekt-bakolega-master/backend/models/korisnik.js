const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const korisnikSchema = new mongoose.Schema({
    username: {
        required: true,
        type: String,
        unique: true,
        maxLength: 50,
        minLength: 5
    },
    ime: {
        required: true,
        type: String,
        maxLength: 50,
        minLength: 2
    },
    passHash: {
        required: true,
        type: String
    },
    isKnjiznicar: {
        type: Boolean,
        required: true,
        default: false
      },
    posudbe: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Kopija"
    }],
    rezervacije: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Kopija",
    }],
    clanarinaIstece: {
        type: Date,
        default: () => Date.now() + 365*24*60*60*1000
    }
})
korisnikSchema.plugin(uniqueValidator)


korisnikSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = doc._id.toString()
        delete ret._id
        delete ret.__v
        delete ret.passHash
        return ret
    }
})

const Korisnik = mongoose.model('Korisnik', korisnikSchema, 'korisnici')

module.exports = Korisnik 