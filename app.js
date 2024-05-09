/*******************************************************************
 * @Purpose: Environment setup
*******************************************************************/
const type = process.env.npm_lifecycle_event;
const fileName = (type === '' || type === 'start') ? 'env' : type + '.env';
//console.log("fileName ==> ",fileName)
require('dotenv').config({ path: './environments/.'+ fileName });

const cookieParser = require('cookie-parser');

/*******************************************************************
 * @Purpose: Database setup
*******************************************************************/
require('./config/db');


/*******************************************************************
 * @Purpose: Server setup
*******************************************************************/
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cluster = require("cluster");
const sticky = require("sticky-session");

/* To parse post request body */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

/* To handle CORS issues */
const cors = require("cors");
app.use(cors());

//require("./routes/index.router")(app);
const rtsIndex = require('./routes/index');//To be deleted
app.use('/api/v1', rtsIndex);//To be deleted
  
   

/*******************************************************************
 * @Purpose: Handle error if any
*******************************************************************/
 app.use((err, req, res) => {
    if (err.name === 'ValidationError') {
        var valErrors = [];
        Object.keys(err.errors).forEach(key => valErrors.push(err.errors[key].message));
        res.status(422).send(valErrors)
    } else {
        //console.log(err);
    }
});


/*******************************************************************
 * @Purpose: create fork to use full cpu uses
*******************************************************************/
app.set("port", 8000);
const http = require("http").createServer(app);

if (!sticky.listen(http, app.get("port"))) {
    http.once("listening", function() {
      console.log("Server started on port " + app.get("port"));
    });
  
    if (cluster.isMaster) {
      var numWorkers = require("os").cpus().length;
      console.log('Master cluster setting up ' + numWorkers + ' workers...');
  
      for (var i = 0; i < numWorkers; i++) {
        cluster.fork();
      }
      console.log('Main server started on port ' + app.get('port'));
  
      cluster.on("online", function(worker) {
        console.log("Worker " + worker.process.pid + " is online");
      });
    }
  } else {
    console.log(
      "- Child server started on port " + app.get("port") +
        " case worker id=" + cluster.worker.id
    );
  }