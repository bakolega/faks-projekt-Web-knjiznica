const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const autorSchema = new Schema({
    ime: { type: String, maxLength: 100 },
    prezime: { type: String, required: true, maxLength: 100 },
    
});

autorSchema.virtual("prezimeIme").get(function () {

    let punoIme = "";
    if (this.ime && this.prezime) {
        punoIme = `${this.prezime}, ${this.ime}`;
    }

    return punoIme;
});

autorSchema.set('toObject', { virtuals: true })
autorSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = doc._id.toString()
        delete ret._id
        delete ret.__v
        return ret
    }
}, { virtuals: true })


module.exports = mongoose.model("Autor", autorSchema, "autori");
