var express = require('express');
var router = express.Router();

const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const collectionName = 'webcom';

/* 
 * npx cross-env DEBUG=web-com-api:* npm start
 * http://localhost:<port>/list 
 * 
 */
router.get('/', function (req, res, next) {

    try {
        transaction(req.query.latitudegt, req.query.latitudelt, req.query.longitudegt, req.query.longitudelt).then(value => {
            res.header('Content-Type', 'application/json; charset=utf-8')
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
           // res.header('Content-Type', 'text/plain; charset=utf-8')
            res.send(value);

        });
    } catch (error) {
        console.log(error);
    } finally {
        //
    }

});


const transaction = async (latitudegt, latitudelt,longitudegt,longitudelt) => {
    let client;

    try {
        let r_latitudegt = parseFloat(latitudegt);
        let r_latitudelt = parseFloat(latitudelt);
        let r_longitudegt = parseFloat(longitudegt);
        let r_longitudelt = parseFloat(longitudelt);

        client = await MongoClient.connect("mongodb://webcom:webcom@127.0.0.1:27017/webcom", {
            useUnifiedTopology: true
        });
       
        let db = client.db("webcom");
        var docs = await db.collection("webcom").find({
            $and: [
                { "location.latitude": { $gt: r_latitudegt } }
                , { "location.latitude": { $lt: r_latitudelt } }
                , { "location.longitude": { $gt: r_longitudegt } }
                , { "location.longitude": { $lt: r_longitudelt } }
            ]
        }).toArray();

        console.log(docs);

        return (docs);
    } catch (error) {
        console.log(error);
    } finally {
        client.close();

    }

}

module.exports = router;
