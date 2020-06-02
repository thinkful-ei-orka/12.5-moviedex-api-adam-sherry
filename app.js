require('dotenv').config();
const data = require('./movies-data-small.js');
const express = require('express');
const morgan = require ('morgan');
const cors = require('cors');
const helmet = require('helmet');
const app = express();
app.use(cors());
app.use(helmet());
app.use(morgan('combined'));
app.use(handleBearerToken);

const apiToken = process.env.API_TOKEN;

function handleBearerToken(req,res,next){
  const authToken = req.get('Authorization')||'';
  if(!authToken.toLowerCase().startsWith('bearer ')){
    res.status(400).json({error:'No valide bearer token provided'});
  }
  if(authToken.split(' ')[1]!==apiToken){
    res.status(401).json({error:'Invalid credentials'});
  }
  next();
}

const handleResponse = (req,res)=>{
  res.json(Response);
};

app.get('/route',handleResponse);

app.listen(8080,()=>console.log('Running on 8080'));