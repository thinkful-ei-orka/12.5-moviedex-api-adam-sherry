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

const apiToken = process.env.API_TOKEN;

function handleBearerToken(req,res,next){
  const authToken = req.get('Authorization')||' ';
  if(!authToken.toLowerCase().startsWith('bearer ')){
    return res.status(400).json({error:'No valid bearer token provided'});
  }
  if(authToken.split(' ')[1]!==apiToken){
    return res.status(401).json({error:'Invalid credentials'});
  }
  next();
}

app.use(handleBearerToken);

const handleResponse = (req,res)=>{
  let result = data;
  const filtering=(arr,value)=>arr.filter(x=>x[value].toLowerCase().includes(req.query[value].toLowerCase()));
  
  if(req.query.genre){result=filtering(result,'genre');}
  if(req.query.country){result=filtering(result,'country');}
  if(req.query.avg_vote){result=result.filter(movie=>movie.avg_vote>=req.query.avg_vote);}

  res.json(result);
};

app.get('/movie',handleResponse);

app.listen(8080,()=>console.log('Running on 8080'));