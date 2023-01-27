const express = require("express");
const app = express();
const fs = require("fs")
const https = require("https")
const port = 5500;
const cors = require("cors");
const vhost = require('vhost');

// Configuramos las variables de ambiente
const dotenv = require("dotenv");
dotenv.config();

// Activar cors
app.use(cors());
// Activar json
app.use(express.json());
app.use(express.urlencoded({extended:true}));
// Abrimos las cors
app.use(cors({
    origin: ["http://example.com", "https://example.com"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "Access-Control-Allow-Origin"]
}));
app.use(vhost('compasscommunity.net', function(req, res){
    console.log("se ha recibido una consulta" + process.env.OPENAI_KEY,);
    try {
        generateImage(req,res);
        // console.log(process.env.OPENAI_KEY);
    } catch (error) {
        console.log("ha ocurrido el siguiente error: " + error);
    }
}));

// Configuramos openAI

const {Configuration, OpenAIApi} = require("openai");

const configuration = new Configuration({
    apiKey:process.env.OPENAI_KEY,
}); 

const openAI = new OpenAIApi(configuration);

// Escuchamos la petición

const options = {
    cert: fs.readFileSync("/etc/letsencrypt/live/compasscommunity.net/cert.pem"),
    key: fs.readFileSync("/etc/letsencrypt/live/compasscommunity.net/privkey.pem"),
    };
// const options = {
//     cert: fs.readFileSync("server.crt"),
//     key: fs.readFileSync("server.key"),
//     };

    https.createServer(options, app).listen(port, () => {
        console.log("Server running on port 5500");
    });


// Get request opanais
app.post('/openai', (req, res) => {
    console.log("se ha recibido una consulta" + process.env.OPENAI_KEY,);
    try {
        generateImage(req,res);
        // console.log(process.env.OPENAI_KEY);
    } catch (error) {
        console.log("ha ocurrido el siguiente error: " + error);
    }
});

app.get("/", (req, res) =>{
    res.send("servidor corriendo")
})
// Funcion que genera la imagen
const generateImage = async (req, res) => {
    try {
        const {prompt} = req.body; 
        const response = await openAI.createImage({
            prompt: prompt,
            n: 1,
            size: "1024x1024"
        });
        const urlIMG = response.data.data[0].url;
        res.status(200).json({
            success: true,
            data: urlIMG,
        });
    } catch (error) {
        res.json({textError: true,
                    textE: error});
	console.log(error);
    }
}
