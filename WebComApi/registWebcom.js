const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
const assert = require('assert')
const Client = require('node-rest-client').Client
//const _ = require('lodash');
const collectionName = 'webcom';

function webComRequest() { 

    let client = new Client();
 
    var offset = 0;

    let baseurl = 'https://api.windy.com/api/webcams/v2/list/limit=50,';
    let parameters = '?lang=en&key=4tpguJklGSjb3f0nVny1wwR9bqHquToz&show=webcams:image,player,location';

    const args = {
        headers: { 'Content-Type': 'application/json' }
    }

    return {
        listWebComUrls: function (offset) {

            webcomsurl = baseurl + offset + parameters;

            return new Promise(resolve => {
                client.get(webcomsurl, args, function (data, response) {
                   // console.log(data.status);

                    if ("OK" != data.status) {
                        return resolve("");
                    } else { 
                        let jsonStr = JSON.stringify(data);
                       //resolve(jsonStr);
                        resolve(data);
                    }
                }).on('error', function (err) {
                    console.log('something went wrong on the request', err.request.options);
                })
            });
        }
    }
}

const webcom = webComRequest();


const transaction = async () => {
    let client;

    try {
        client = await MongoClient.connect("mongodb://webcom:webcom@127.0.0.1:27017/webcom", {
            useUnifiedTopology: true
        });

        const db = client.db("webcom");
	const collections = await db.listCollections().toArray();

	let isfound = false;
	collections.forEach(collection => {
		console.log(collection);
		if (collection.name == collectionName){
			isfound = true;
		}
	});
	if (isfound){
       		db.collection(collectionName).drop();
	}
        var offset = 0;
        var total = 1; // set for start 
        while (offset < total) {
            var data = await webcom.listWebComUrls(offset);

            offset += 50;

            let webcomarray = data["result"]["webcams"];
            await db.collection(collectionName).insertMany(webcomarray);
            let stored = await db.collection(collectionName).count();
            console.log('stored ' +  stored);
            total = data["result"]["total"];
        }
       // const docs = await db.collection("myCollection").find({}).toArray();
       // console.log(docs);
        return true;
    } catch (error) {
        console.log(error);
    } finally {
        client.close();
    }
};

transaction();
