const mongoose = require('mongoose');

const clothesSchema = new mongoose.Schema({
    title: String,
    price: {
        type: String,
        default: 0
    },
    description: String,
});

const Clothes = mongoose.model('Clothes', clothesSchema);

module.exports = Clothes;
