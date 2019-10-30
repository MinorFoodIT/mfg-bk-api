var express = require('express');
var logger = require('./../common/logging/winston')(__filename)
var sdkCache = require('./../common/sdkCache');
var sdkRouter = require('./sdk/sdk.route');
const APIError = require('./../common/APIError');
const APIResponse = require('./../common/APIResponse');
//var adminRouter = require('./admin/admin.route');

//Authenticate
const  jwt  =  require('jsonwebtoken');
const  bcrypt  =  require('bcryptjs'); 
const SECRET_KEY = process.env.JWT_SECRET || "secretMinorFood";
var database = require('./../common/database/auth-db');

//Routes
var router = express.Router();
// mount bot routes at /bot
router.use('/v1', sdkRouter);

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) => {
      logger.info('/api/health-check => OK Server up')
      res.json({
          status: 'SERVER UP',
          services: sdkCache
        });
    }
);

router.post('/register', (req, res) => {
    const  name  =  req.body.name;
    const  email  =  req.body.email;
    const  password  =  bcrypt.hashSync(req.body.password);

    logger.info('/api/register => name='+name +',email='+email);
    database.createUser([name, email, password], (err)=>{
        if(err){
            return res.status(500).json((new APIError('create user : '+err.code,500,true)).returnJson());
        }else{
            database.findUserByEmail(email, (err, user)=>{
                if (err){
                    return  res.status(500).send((new APIError('find user : '+err.code,500,true)).returnJson());  
                }else{
                    const  expiresIn  =  24  *  60  *  60;
                    const  accessToken  =  jwt.sign({ id:  user.id }, SECRET_KEY, {
                        expiresIn:  expiresIn
                    });
                    // "user":  user
                    res.status(200).send({ "access_token":  accessToken, "expires_in":  expiresIn          
                    });
                }
            });
        }
    });
});

//login and refresh token
router.post('/login', (req, res) => {
    const  email  =  req.body.email;
    const  password  =  req.body.password;
    logger.info('/api/login => name='+name +',email='+email);
    database.findUserByEmail(email, (err, user)=>{
        if (err) return  res.status(500).send((new APIError(err,500,true)).returnJson());
        if (!user) return  res.status(404).send((new APIError('User not found!',404,true)).returnJson());
        const  result  =  bcrypt.compareSync(password, user.password);
        if(!result) return  res.status(401).send((new APIError('Password not valid!',404,true)).returnJson());

        const  expiresIn  =  24  *  60  *  60;
        const  accessToken  =  jwt.sign({ id:  user.id }, SECRET_KEY, {
            expiresIn:  expiresIn
        });
        //"user":  user,
        res.status(200).send({  "access_token":  accessToken, "expires_in":  expiresIn});
    });
});

module.exports = router;
