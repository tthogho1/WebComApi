const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const assert = require('assert');
const restClient = require('sync-request');
//const _ = require('lodash');
const collectionName = 'webcom';
const sendurl = 'http://localhost:8080/inifinispanCache/postThumnailUrl';



async function transaction() {
    let client;

    try {
        client = await MongoClient.connect("mongodb://webcom:webcom@127.0.0.1:27017/webcom", {
            useUnifiedTopology: true
        });

        const db = client.db("webcom");
        const docs = await db.collection("webcom").find({}).toArray();

        // console.log(docs);

        return new Promise((resolve, reject) => {
            resolve(docs);
        });
    } catch (error) {
        console.log(error);
    } finally {
        client.close();
    }
};

transaction().then(result => {
    console.log(result);
    docs = result;

    // var restClient = new Client();

    for (i = 0; i < docs.length; i++) {

        let doc = docs[i];
        surl = "";
        try {
            surl = doc.image.daylight.thumbnail;
        } catch (ex) {
            console.log(ex);
            continue;
        }

        let urldata = {
            url: surl
        };

        console.log(urldata);

        let jurl = JSON.stringify(urldata);
        var response = restClient('POST',
            sendurl, { json: urldata }
        );

        console.log(response.getBody('utf8'));

    }

});


