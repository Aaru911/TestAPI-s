const express = require('express');
const path = require('path')
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const genAI = new GoogleGenerativeAI("AIzaSyB-Accm325ckE3cST6OAqt5yePciuifo4k");


const app = express();
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended:false}));

const port = parseInt(process.env.PORT) || process.argv[3] || 8080;

app.use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index',{data:"Hello"});
});

app.post('/',async(req,res)=>{
  const raw_data= req.body.t1;
  const data = await run(raw_data);

  res.render('index',{data:data});
});


async function run(prop) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});
  const prompt = prop;
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  console.log(text);
  return text;
}

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
})
