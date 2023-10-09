var messageModel = require('../models/chat').messageModel;
var roomModel = require('../models/chat').roomModel;
var notificationModel = require('../models/chat').notificationModel;
var methods = require('../methods/methods')

var io = require('../server.js').io;
const nsp = io.of('/saleSucceed');
nsp.on('connection', function(socket) {
    console.log("someone connected -------------------------------------------------------------------------");
    var addMessage = async function(data) {
         console.log('Add message', data);
        await new messageModel(data).save();
    }

    var addRoom = async function(room) {
        var chatData = await roomModel.findOne({ 'roomId': room.room_id });
        if (!chatData) {
            await new roomModel({ 'roomId': room.room_id, 'seekerId': room.seekerId, 'salesId':room.salesId, 'businessId': room.businessId, 'creator': room.creator, 'createdAt': new Date()}).save();
        }
    }
   /////////////////// 
    var addnotification = async function(notify) {
        await new notificationModel({ 'roomId': notify.room_id, 'seekerId': notify.seekerId,  'businessId': notify.businessId,'description':notify.description, 'message': notify.message,'title':notify.title,'sentTo':notify.sentTo,'sentFrom':notify.sentFrom,'salesId':notify.salesId, 'createdAt': new Date()}).save();
    }
////////////////////
// var addMsg = async function(notify) {
//     await new notificationModel({ 'roomId': notify.room_id, 'seekerId': notify.seekerId,  'businessId': notify.businessId, 'message': notify.message,'title':notify.title,'sentTo':notify.sentTo,'sentFrom':notify.sentFrom, 'createdAt': new Date()}).save();
 
// }
//////////
    socket.on('join_room', function(room) {
        console.log('Join room ------------', room);
        addRoom(room);
        socket.join(room.room_id);
    }); 

    socket.on('send_message', function(data) {
        console.log('Send message ------------', data);

        var saveMessage = {
            'seekerId': data.seekerId,
            'businessId': data.businessId,
            'salesId': data.salesId,
            'send_from': data.send_from,
            'send_to': data.send_to,
            'roomId': data.room_id,
            'message': data.message,    
            'createdAt': data.date_now
        };
        // console.log(saveMessage)
        addMessage(saveMessage);
        socket.broadcast.to(data.room_id).emit('chat_message', {
            send_from: data.send_from,
            room_id: data.room_id,
            message: data.message,
            createdAt: data.date_now
        });
    });
/////////////////
    socket.on('send_notification', function(notify) {
        console.log('Send notification ------------', notify);

        var saveNotification = {
            'seekerId': notify.seekerId,
            'businessId': notify.businessId,
            'title':notify.title,
            'salesId':notify.salesId,
            'description':notify.description,
            'sentTo': notify.sentTo,
            'sentFrom': notify.sentFrom,
            'roomId': notify.room_id,
            'message': notify.message,
            'createdAt':notify.date_now   
        }   
        addnotification(saveNotification);
        socket.broadcast.to(notify.room_id).emit('notification_message', {
            sentFrom: notify.sentFrom,
            room_id: notify.room_id,
            message: notify.message,
            title:notify.title,
            description:notify.description,
            createdAt: notify.date_now
        });
        var Notiobj = {
            'seekerId': notify.seekerId,
            'businessId': notify.businessId,
            'description': notify.description,
            'sentTo':notify.sentTo
        }
        methods.chatNotification(Notiobj);
    });
////////////////////
    socket.on('typing', function(room) {
        console.log('Typing ------------', room);
        socket.broadcast.to(data.room_id).emit('user_tbusinessyping', {
            message: 'typing.......',
        });
    });
});