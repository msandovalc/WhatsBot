const express = require('express');
const app = express();
const { Client, MessageMedia } = require('whatsapp-web.js');
const config = require('./config')
const qr = require('./modules/qr');
const zee = require('./modules/zee5');
const saavn = require('./modules/jiosaavn');
const pmpermit = require('./modules/pmpermit');
const carbon = require('./modules/carbon');
const telegraph = require('./modules/telegraph');
const serveIndex = require('serve-index');
const youtube = require('./modules/youtube');
const weather = require('./modules/weather');
const { exec } = require('child_process');
const help = require('./modules/help');
const utils = require('./modules/utils');
const translator = require('./modules/translator');
const start = require('./modules/start');
const bonusimage = require('./modules/bonusimage');
const residualimage = require('./modules/residualimage');
const ud = require('./modules/ud');
const { promisify } = require('util')
const sleep = promisify(setTimeout)
const messages = require('./messages')


const client = new Client({ puppeteer: { headless: true, args: ['--no-sandbox'] }, session: config.session });

client.initialize();

client.on('auth_failure', msg => {
    console.error("There is a problem to authenticate, Kindly set the env var again and restart the app");
});

client.on('ready', () => {
    console.log('Bot has been started');
});

client.on('message', async msg => {
    console.log('MESSAGE RECEIVED', msg);

    if (msg.body === '!start') {
        const contact = await msg.getContact();
        const chat = await msg.getChat();
        var message = await utils.getMessage('!bienvenida');

        console.log(message);

        // simulates typing in the chat
        chat.sendStateTyping();
        await sleep(4500); // 4.5 seconds

        chat.sendMessage(`Hola @${contact.number}` + message.response, {
            mentions: [contact]
        });

        message = await utils.getMessage('!menu');

        // simulates typing in the chat
        chat.sendStateTyping();
        await sleep(4500); // 4.5 seconds

        client.sendMessage(msg.from, message.response);

    } else if (msg.body === '1' || '2' || '3' || '4' || '5') {
        const chat = await msg.getChat();
        const message = await utils.getMessage(msg.body);

        console.log(message);

        // simulates typing in the chat
        chat.sendStateTyping();
        await sleep(4500); // 4.5 seconds

        // Send a new message to the same chat
        client.sendMessage(msg.from, message.response);

        if (message.youtube !== undefined && message.youtube !== ""){

            console.log("INSIDE IF YOUTUBE");

            console.log(message.youtube);

            message.youtube.forEach(async function(element) { 
                            
                console.log("INSIDE FOR EACH YOUTUBE");

                // Simulates typing in the chat
                chat.sendStateTyping();
                sleep(4500); // 4.5 seconds
        
                console.log(element);

                // Youtube Video
                var data = await youtube.mainF(element);

                console.log("YOUTUBE DATA");
                console.log(data);

                if (data == "error") {
                client.sendMessage(msg.to, `🙇‍♂️ *Error*\n\n` + "```Something Unexpected Happened to fetch the YouTube video```")
                } else {
                client.sendMessage(msg.from, new MessageMedia(data.image.mimetype, data.image.data, data.image.filename), 
                            { caption: `*${data.title}*\n\n` + "*" + data.youtubeview_link + "*" });
                }
              
            });


        } else {
            /* do nothing */
        }

        if (message.file !== undefined && message.file !== ""){

            // Simulates typing in the chat
            chat.sendStateTyping();
            await sleep(4500); // 4.5 seconds

            message.file.forEach(async function(element) { 
                
                file = await utils.getFileInBase64(element)

                console.log(file.name);
                console.log(file.mimetype);
        
                // Send a new media message to the same chat
                client.sendMessage(msg.from, new MessageMedia(file.mimetype, file.data, file.name), 
                                                        { caption: "" });
              
            });

        } else {
            /* do nothing */
        }

        if (message.link !== undefined && message.link !== ""){

            // Simulates typing in the chat
            chat.sendStateTyping();
            await sleep(4500); // 4.5 seconds
    
            // Send a new message to the same chat
            client.sendMessage(msg.from, message.link);

        } else {
            /* do nothing */
        }

    } else if (msg.body === '!chats') {
        const chats = await client.getChats();
        client.sendMessage(msg.from, `The bot has ${chats.length} chats open.`);
    } else if (msg.body === '!info') {
        let info = client.info;
        client.sendMessage(msg.from, `
            *Connection info*
            User name: ${info.pushname}
            My number: ${info.me.user}
            Platform: ${info.platform}
            WhatsApp version: ${info.phone.wa_version}
        `);
    } else if (msg.body === '!typing') {
        const chat = await msg.getChat();
        // simulates typing in the chat
        chat.sendStateTyping();
    } else if (msg.body === '!recording') {
        const chat = await msg.getChat();
        // simulates recording audio in the chat
        chat.sendStateRecording();
    } else if (msg.body === '!clearstate') {
        const chat = await msg.getChat();
        // stops typing or recording in the chat
        chat.clearState();
    } else if (msg.body === '!menu') {


    } 
});

client.on('message_create', (msg) => {
    // Fired on all message creations, including your own
    if (msg.fromMe) {
        // do stuff here
    }
});

client.on('message_revoke_everyone', async (after, before) => {
    // Fired whenever a message is deleted by anyone (including you)
    console.log(after); // message after it was deleted.
    if (before) {
        console.log(before); // message before it was deleted.
    }
});

client.on('message_revoke_me', async (msg) => {
    // Fired whenever a message is only deleted in your own view.
    console.log(msg.body); // message before it was deleted.
});

client.on('message_ack', (msg, ack) => {
    /*
        == ACK VALUES ==
        ACK_ERROR: -1
        ACK_PENDING: 0
        ACK_SERVER: 1
        ACK_DEVICE: 2
        ACK_READ: 3
        ACK_PLAYED: 4
    */

    if(ack == 3) {
        // The message was read
    }
});

client.on('group_join', (notification) => {
    // User has joined or been added to the group.
    console.log('join', notification);
    notification.reply('User joined.');
});

client.on('group_leave', (notification) => {
    // User has left or been kicked from the group.
    console.log('leave', notification);
    notification.reply('User left.');
});

client.on('group_update', (notification) => {
    // Group picture, subject or description has been updated.
    console.log('update', notification);
});

client.on('change_battery', (batteryInfo) => {
    // Battery percentage for attached device has changed
    const { battery, plugged } = batteryInfo;
    console.log(`Battery: ${battery}% - Charging? ${plugged}`);
});

client.on('disconnected', (reason) => {
    console.log('Client was logged out', reason);
});

app.get('/', (req, res) => {
    res.send('<h1>This server is powered by Whatsbot<br><a href="https://github.com/TheWhatsBot/WhatsBot">https://github.com/TheWhatsBot/WhatsBot</a></h1>')
})

app.use('/public', express.static('public'), serveIndex('public', { 'icons': true })) // public directory will be publicly available

app.listen(process.env.PORT || 8080, () => {
    console.log(`Server listening at Port: ${process.env.PORT || 8080}`)
})