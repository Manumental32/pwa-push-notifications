
import * as express from 'express';
import {Application} from "express";
import {readAllLessons} from "./read-all-lessons.route";
import {addPushSubscriber} from "./add-push-subscriber.route";
import {sendNewsletter} from "./send-newsletter.route";
const bodyParser = require('body-parser');

const webpush = require('web-push');

const vapidKeys = {
    "publicKey":"BNcqrTZPI8VKShEohLDOsePBAt0sHT-m7lRLQ8QdoOxEmTylnBaORrdtc9EJFjUEmbGlOQ9CMe9Bl7sIW6ibqfQ",
    "privateKey":"_Po2x2P4SCTC8nGVLA4ioselZMf2I4_JoBz4J2z-CXE"
};


webpush.setVapidDetails(
    'mailto:manuel.aquino.utn@gmail.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
);




const app: Application = express();


app.use(bodyParser.json());


// REST API
app.route('/api/lessons')
    .get(readAllLessons);

app.route('/api/notifications')
    .post(addPushSubscriber);

app.route('/api/newsletter')
    .post(sendNewsletter);



// launch an HTTP Server
const httpServer = app.listen(9000, () => {
    console.log("HTTP Server running at http://localhost:" + httpServer.address().port);
});









