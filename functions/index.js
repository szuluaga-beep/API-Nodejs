const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");

var serviceAccount = require("./permissions.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fir-api-9a206..firebaseio.com",
});

const db = admin.firestore();

const app = express();
app.use(cors({ origin: true }));

app.get("/hello-world", (req, res) => {
  return res.status(200).send("Hello World!");
});


// create
app.post('/api/create', (req, res) => {
    (async () => {
        try {
          await db.collection('Books').doc('/' + req.body.id + '/')
              .create({nombre: req.body.nombre,autor:req.body.autor,genero:req.body.genero,descripcion:req.body.descripcion});
          return res.status(200).send();
        } catch (error) {
          console.log(error);
          return res.status(500).send(error);
        }
      })();
});
  //get Book
  app.get("/api/read/:item_id", (req, res) => {
    (async () => {
      try {
        const document = db.collection("Books").doc(req.params.item_id);
        let item = await document.get();
        let response = item.data();
        return res.status(200).send(response);
      } catch (error) {
        console.log(error);
        return res.status(500).send(error);
      }
    })();
  });
  // read all
app.get('/api/read', (req, res) => {
    (async () => {
        try {
            let query = db.collection('Books');
            let response = [];
            await query.get().then(querySnapshot => {
            let docs = querySnapshot.docs;
            for (let doc of docs) {
                const selectedItem = {
                    id: doc.id,
                    items: doc.data()
                };
                response.push(selectedItem);
            }
            });
            return res.status(200).send(response);
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
        })();
});
    
// update
app.put('/api/update/:item_id', (req, res) => {
(async () => {
    try {
        const document = db.collection('Books').doc(req.params.item_id);
        await document.update({
            items: req.body
        });
        return res.status(200).send();
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
    })();
});

// delete
app.delete('/api/delete/:item_id', (req, res) => {
(async () => {
    try {
        const document = db.collection('Books').doc(req.params.item_id);
        await document.delete();
        return res.status(200).send();
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
    })();
});
exports.app = functions.https.onRequest(app);
