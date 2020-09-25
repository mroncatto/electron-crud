const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/electron', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
    .then(db => console.log("DB is connected"))
    .catch(err => console.log(err));