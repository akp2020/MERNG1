const express = require("express");
const graphqlHTTP = require('express-graphql');
const schema = require( "./schema/schema");
const mongoose = require("mongoose");

const app = express();
// connect mongoDB
mongoose.connect('mongodb+srv://akp:mongodb2020@god-cchw4.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true }, () => {
	console.log('db-#$$#connected ');
});

/*mongoose.connect('mongodb+srv://akp:mongodb2020@god-cchw4.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true ,useUnifiedTopology: true });
mongoose.connection.once('open', () => {
    console.log('conneted to database');
});*/


//ends

app.use('/g', graphqlHTTP({
	schema: schema,
	graphiql: true
}));

app.listen(4000, ()=>{
	console.log('hello');
});