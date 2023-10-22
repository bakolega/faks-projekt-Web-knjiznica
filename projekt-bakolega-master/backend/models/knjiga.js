const mongoose = require('mongoose')



const knjigaSchema = new mongoose.Schema({
    naziv: { type: String, required: true },
    autor: { type: mongoose.Schema.Types.ObjectId, ref: "Autor", },
    godina: Number,
    izdavac: String,
    isbn: String
})

knjigaSchema.index({'$**': 'text'});

knjigaSchema.virtual("url").get(function () {
    return `/api/knjige/${this._id}`;
});


knjigaSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = doc._id.toString()
        delete ret._id
        delete ret.__v
        return ret
    }
})

const Knjiga = mongoose.model('Knjiga', knjigaSchema, 'knjige')

module.exports = Knjiga


