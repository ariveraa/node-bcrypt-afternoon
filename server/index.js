require('dotenv').config();
const express =require('express'), 
    massive = require('massive'), 
    session  = require('express-session'), 
    authCtrl =require('./controllers/authController'),
    treasureCtrl = require('./controllers/treasureController'),
    auth =require('./middleware/authMiddleware'), 
    cors = require('cors'),
    {SERVER_PORT, CONNECTION_STRING, SESSION_SECRET} = process.env, 
    app =express(); 

app.use(cors()); 
app.use(express.json()); 



massive(CONNECTION_STRING).then(db => {
    app.set('db', db);
    console.log('db connected');
})

app.use(session({
    resave:true, 
    saveUninitialized: false, 
    secret: SESSION_SECRET
}))

app.post('/auth/register' , authCtrl.register);
app.post('/auth/login', authCtrl.login);
app.get('/auth/logout', authCtrl.logout);

//treasure endpoints 
app.get('/api/treasure/dragon', treasureCtrl.dragonTreasure); 
app.get('/api/treasure/user',auth.usersOnly, treasureCtrl.getUserTreasure); 
app.get('/api/treasure/all', auth.usersOnly, auth.adminsOnly, treasureCtrl.getAllTreasure)
app.post('/api/treasure/user',auth.usersOnly, treasureCtrl.addUserTreasure); 


const port=SERVER_PORT;
app.listen(port, ()=> console.log(`server running on ${port}`)) 

