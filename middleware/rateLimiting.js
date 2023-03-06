const AccessModel = require("../models/AccessModel");

const rateLimiting = async (req, res, next) => {
    const sessionId = req.session.id;

    if(!sessionId){
        return res.send({
            status: 400,
            message: "Invalid session, please login again!" 
        })
    }

    //rate limiting logic
    //check if the user has access recently or not
    const sessionDb = await AccessModel.findOne({sessionId : sessionId})

    // console.log(sessionDb);

    //if sessionDb is not there, that means user is accessing the controller for the first time

    if(!sessionDb){
        //creste a new entry in the access model
        const accessTime = new AccessModel({
            sessionId : sessionId,
            time : Date.now() 
        })
        await accessTime.save();
        next()
        return;
    }

    //if the entry was there, we need to compare the sessionDb.time
    const previousAccessTime = sessionDb.time;
    const currentTime = Date.now();

    // console.log(currentTime - previousAccessTime);
    // 1request / 2sec
    if(currentTime - previousAccessTime < 2000){
        return res.send({
            status : 401,
            message: "Too many request, please try after some time"
        })
    }

    //allow the person to make the request by updating the previous time to currenttime
    try {
        await AccessModel.findOneAndUpdate(
            {sessionId : sessionId},
            {time : Date.now()}
        );

        next()
    } catch (error) {
        return res.send({
            status : 400,
            message : "Bad request!",
            error : error,
        })
    }

};

module.exports = rateLimiting;
