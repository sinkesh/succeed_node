var mongoose = require('mongoose');

mongoose.connect("mongodb+srv://ankesh_kumar:ankeshkumar@cluster0.k5fj9.mongodb.net/sales", {
    keepAlive: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
});
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

module.exports = { mongoose };