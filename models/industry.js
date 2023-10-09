var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var IndustrySchema = Schema({
    name: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date
    }
});

var sectorSchema = Schema({
    name: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date
    }
});

module.exports = {
    IndustryModel: mongoose.model('industries', IndustrySchema),
    sectorModel: mongoose.model('sectors', sectorSchema)
}