const express = require('express');
const app = express();
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const SwaggerUI = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const cors = require('cors')
const mongoose = require('mongoose');

//import routes

const authRoutes = require('./routes/auth');
const blogRoutes = require('./routes/blog');

dotenv.config();



// swagger documentation
const swaggerOptions = {  
    swaggerDefinition: {
        openapi : '3.0.0',
        info : {
            title: 'Ben Apis documentation',
            version: '1.0.0',
            description: 'register and login',
            contact:{
                name :"benjamin"
            },
        },
        servers:[ 
            { 
                url:'http://localhost:3000'
            } 
        ],
       
    },
    apis: ['./docs/*.js']
}
const swaggerDocs = swaggerJSDoc(swaggerOptions)


//middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

//routes middlewares and in runnig the code in postman add /user as below the in routes
app.use('/user', authRoutes);
app.use('/user', blogRoutes);


app.use('/api-docs', SwaggerUI.serve, SwaggerUI.setup(swaggerDocs));


//connect to database where there link of database is in the env file which need dotenv dependecies to work
mongoose.connect(process.env.DB_CONNECT)
    .then(() => console.log('connected to db'))
    .catch((error) => console.log('connection error:', error)
);


app.listen(3000, () => console.log('server is running at 3000'));