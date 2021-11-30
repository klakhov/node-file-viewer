
const mongoose = require('mongoose');
const config = require('./config/config');
const app = require('./app/app');

async function start(){
    await mongoose.connect(config.mongoURI, {useNewUrlParser: true, useUnifiedTopology: true});
    app.listen(config.port, function(){
        console.log(`app works on ${config.port} port`);
    });
}

start();