const express=require('express')

const app =express();
const dontenv=require('dotenv').config();;

const mongoose = require("mongoose");
const cookieParser=require('cookie-parser');

const AppError=require('./utils/appError');

const bodyparser=require('body-parser');

const songRoute = require('./routes/song-route');
const logger = require('./utils/logger');
const errorHandler=require('./middlewares/errorhandler');
const expressPinoLogger = require('express-pino-logger');

var cors = require('cors')
const loggerMidlleware = expressPinoLogger({
    logger: logger,
    autoLogging: true,
  });
  
app.use(loggerMidlleware);  
    app.use((req,res,next)=>{
        req.requestTime=new Date().toISOString();
        next();
    });
app.use(cors())
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(bodyparser.json());


mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology:true,
    useFindAndModify:false
  })
  .then(() => console.log("MongoDB connected..."))
  .catch((err) => console.log(err));

  




app.use('/v1/song', songRoute);
 app.use(errorHandler
        );


app.all('*',(req,res,next)=>{

    next(new AppError(`can't find ${req.originalUrl} on this server `,404));
})
  
const port=process.env.PORT||7000;

app.listen(port,()=>{console.log(`server  litsens as port ${port}`)});