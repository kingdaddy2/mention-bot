const express = require('express');
const app = express();
app.get("/", (request, response) => {
  response.sendStatus(200);
});
let Eris = require('eris')
app.listen(process.env.PORT);
let client = new Eris("ODEzMDI4ODA0NTE5Mzk1NDE4.YDJWFA.cmmsLjCVYxd_r5N4kt3-_15mhaU" , { restMode:true , defaultImageSize:2048 , disableEvents: ["voiceChannelJoin" , "voiceChannelSwitch" , "voiceChannelLeave" , "callCreate" , "callDelete" , "callRing" , "callUpdate"] });
let dbs = require('./db/mongoose.js')

let db = new dbs()
client.on('ready', () =>{
console.log('Ready')
})
let prefix = "#"
client.on('guildMemberAdd', async (guilds, member) =>{
if(member.bot) return;
let rows = await db.getmentions({guild: guilds.id})
if(rows.length < 1) return;
for(const data of rows){
var able = true
client.createMessage(data.id, data.message.replace('[user]', `<@${member.id}>`)).catch(err =>{
able = false
}).then(async msg =>{
if(!able && msg) return msg.delete().catch(err =>{ return;})
if(!able) return;
await new Promise((res , rej) =>{ setTimeout(() => res() , data.time)})
msg.delete()
})
}
})
client.on('messageCreate', async (message) => {
	if (message.author.bot || !message.channel.guild) return;
let commandNames = message.content.split(" ")[0].toLowerCase()
	let args = message.content.slice(prefix.length).trim().split(/ +/);

	let commandName = args.shift().toLowerCase();

if(!message.content.startsWith(prefix)) return;
let msg = message
let data = [{
prefix:prefix
}]
if(commandName === "mention"){
if(!msg.member.permission.has("manageRoles")) return client.createMessage(msg.channel.id, `**Missing Permission**`)
if(!args[0]) return client.createMessage(msg.channel.id, `يرجي كتابة الامر مع التحديد 
${data[0].prefix}mention 'create','remove','info'`)
let mentions = msg.channel.guild.channels.get(msg.channelMentions[0])
if(!mentions) mentions = msg.channel.guild.channels.get(args[1])
if(args[0] === "create"){
if(!mentions) return client.createMessage(msg.channel.id, "i can't find this channel")
if(!args[2]) return client.createMessage(msg.channel.id, `use ${prefix}mention create [channel] [message]`)
let rows = await db.getmentions({id: mentions.id})
if(rows.length < 1){
 client.createMessage(msg.channel.id, 'Done Create')
await db.insertmentions({message: args.slice(2).join(" "), id: mentions.id, guild: msg.channel.guild.id})
}else{
 client.createMessage(msg.channel.id, "This room Already Create")
}
}
if(args[0] === "info"){
let rows = await db.getmentions({guild: msg.channel.guild.id})
let msgs = ``
for(const data of rows){
msgs = msgs + `\n===============
Channel: <#${data.id}> (${data.id})
Message: ${data.message}
===============`
}
client.createMessage(msg.channel.id, msgs || "This Server dont have any Gmention")
}
if(args[0] === 'edit'){
if(!mentions) return client.createMessage(msg.channel.id, "i can't find this channel")
if(!args[2]) return client.createMessage(msg.channel.id, `use ${prefix}mention edit [channel] [newmessage]`)

let rows = await db.getmentions({id: mentions.id})
if(rows.length < 1){
 client.createMessage(msg.channel.id, "I Can't find this channel in my data")
}else{
await db.updatementions(mentions.id, args.slice(2).join(" "))
 client.createMessage(msg.channel.id, "Done Edit This Channel!")
}
//mentions
}
if(args[0] === 'time'){
if(!mentions) return client.createMessage(msg.channel.id, "i can't find this channel")
if(!args[2]) return client.createMessage(msg.channel.id, `use ${prefix}mention edit [channel] [time]`)

let rows = await db.getmentions({id: mentions.id})
if(rows.length < 1){
 client.createMessage(msg.channel.id, "I Can't find this channel in my data")
}else{
let ms = require('ms')
if(!ms(args.slice(2).join(" "))) return client.createMessage(msg.channel.id, "Error In Time")
await db.updatementionstime(mentions.id, ms(args.slice(2).join(" ")))
 client.createMessage(msg.channel.id, "Done Edit This Channel!")
}
//mentions
}
if(args[0] === "remove"){
let rows = await db.getmentions({id: args[1].replace('<#', '').replace('<!#', '').replace('>', '')})
if(rows.length < 1){
 client.createMessage(msg.channel.id, "i can't find this channel in my data")
}	else{
await db.deletemntions({id: rows[0].id})
 client.createMessage(msg.channel.id, "Done Remove Room")
}
}
}
})
client.connect()
