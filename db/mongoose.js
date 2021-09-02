const mongoose = require("mongoose")
let EventEmitter = require("events");

mongoose.connect("mongodb+srv://yousuf:41371755aa@cluster0.agy3h.mongodb.net/mentions" , {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      autoIndex: false,
      reconnectTries: Number.MAX_VALUE,
      reconnectInterval: 500,
      poolSize: 5,
      connectTimeoutMS: 10000,
      family: 4
    });

const mentions = mongoose.model("mentions", new mongoose.Schema({
            _id: { type: mongoose.Schema.Types.ObjectId, required: true, auto: true },
            "id": { type: String } ,
            "guild": { type: String } ,
           "message": { type: String } ,
           "time": { type: Number, default: 3000 } ,

}))


    mongoose.connection.on('connected', async () =>{
      console.log('Mongoose has successfully connected!')

    });
    
    mongoose.connection.on('err', err => {
      console.error(`Mongoose connection error: \n${err.stack}`)
    });
    
    mongoose.connection.on('disconnected', () =>{
      console.warn('Mongoose connection lost')
    });

 class index extends EventEmitter {
constructor () {
  super  ()
}


async insertmentions(data){
return await new mentions(data).save();
}
async updatementions(data, data2){
return await mentions.updateOne({id: data}, {"message": data2})
}
async getmentions(data){
return await mentions.find(data)
}
async deletemntions(data){
return await mentions.deleteOne(data)
}
async updatementionstime(data, data2){
return await mentions.updateOne({id: data}, {"time": data2})
}

 }
module.exports = index