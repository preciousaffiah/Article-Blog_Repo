// author: Precious Affiah 2022

const mongoose = require('mongoose');
require('dotenv').config();

const connectionParams = {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
}

const uri = `mongodb+srv://username:password@cluster0.di9pr.mongodb.net/?retryWrites=true&w=majority`
const connection = mongoose.connect(uri, connectionParams).then(()=>console.log('connected to cloud atlas'))
.catch((err)=>console.log(err));

module.exports = connection  