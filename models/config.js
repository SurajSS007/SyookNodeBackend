const mongoose = require('mongoose');
const url = 'mongodb+srv://suraj:qwerty1234@cluster0.zdxqd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
//this is for connnecting MongoDB
mongoose.connect(url, { 
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true
}, (err) => {
    if (!err) { console.log('MongoDB Connection Succeeded.') }
    else { console.log('Error in DB connection : ' + err) }
});


require('./personModel')
require('./userModel')
