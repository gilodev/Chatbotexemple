"use strict";
// ----------------------- NOS MODULES -------------------------
const bodyParser = require("body-parser");
const crypto = require("crypto");
const express = require("express");
const fetch = require("node-fetch");
const request = require("request");
const requestify = require("requestify");
const firebase = require("firebase");
const admin = require("firebase-admin");

let Wit = null;
let log = null;
try {
  Wit = require("../").Wit;
  log = require("../").log;
} catch (e) {
  Wit = require("node-wit").Wit;
  log = require("node-wit").log;
}

// ----------------------- FIREBASE INIT -------------------------
firebase.initializeApp({
  apiKey: "AIzaSyCc_ZhEgwNwTVAharG9zijSzRHLLpdp8Uc",
  authDomain: "chatbotexemple-f3ddb.firebaseapp.com",
  projectId: "chatbotexemple-f3ddb",
  storageBucket: "chatbotexemple-f3ddb.appspot.com",
  messagingSenderId: "824968506097",
  appId: "1:824968506097:web:2299eb4759c17c6149d750",
});

admin.initializeApp({
  credential: admin.credential.cert({
    type: "service_account",
    project_id: "chatbotexemple-f3ddb",
    private_key_id: "3e5f70b39610ad815bf50655d87ed63a0340b317",
    private_key:
      "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCSZxr1TXUF1HrL\nJgZ8epfBQESEOy00+wkcZh+cF30iDpJKR+eOg4976idc0+zkIxyOxvFiqNhhDUCY\nmZSqf4LxUgXoxvXw1S7PuVFHoLOqX9xCKUEau9kzLo2hb+8h9VFO091+FzKSxJ3s\nM18+LAZGOhSHGlkasWzFGvG60E+1L6wUVz0sZGpuESmWvMdspu+fupD7JP7PpUzD\n/jsHnXAAb/9ODljfrEEnl9zGX7OB/wYckA5DE2gzR0EZT6oNVKAFkHkmNwuOkEH/\ns2aVG6W2uOk6m7uCaa1K7q27oGmoq5plAdz/44kp8z1Al31QAPxgA2+t48ibkx1J\nYExmnVL3AgMBAAECggEAP4MJN+e9X6UZDC5X3AKW+Rg3YSIG75gEENTg26d4+qBV\nqHHfK305bula4DNz7lipF+uIZmOXUysbndfqnbiphqUtuRkvMqZZI3Zio2884imp\n9O3Ot5lMlZ6ZhLJ5jELPXiIdUYkgwHkZhZGXvPH+WtLxetbcVu8nn66btY6PNatr\nrMKIOKpnJ1ZIIeJDm6jHEtq+g2EMG0TyRyz2j0GEsEcAG/lpZ7owwN3KZ0hPu3MS\nOEyoYkSmESxfxh50RbQemwEmCwIjcsKrnk6zDWq6BnOo2jWu6DrcAt/0eRgs7X8Z\nA9cjOBWgMoZMwbYe/uH+J8Q4YnyIzoRbL2IRglE0EQKBgQDIBF2rs65ryb5Or3hm\nNZliqFupkIGRa916VW+eeb2GmxlBPgDIh1fCB6vuwDPi8jnji6h00HGQ0aB6/aVZ\nLpjPtKpJ7J7qOjf+v9jUyJEEJJWdeQ/yZPVP4mv71qOgIktiVBL1NiqDfffxjPoP\nv/QUeLsgSmmZT/lHYk5z8ydvfwKBgQC7YSoVVkqA5lkSo2OzfNUa+ckWfVy4tR/g\n8hR/il8NY0Cts8OAG+7jYvZfTlV1kRYhm7X9InLxs9adK5d+VMRUN96aOuqPXxOn\n5jIPhj0AYAOW1a8JRWrj5fCrdLwL4VYstluohabnLpoVTosUdy5GejFI7Rlb/fJe\nOrnZD1FYiQKBgQCW3XQpxmWRN6Irh36w2UzQdVxuEWkpXsq3Myn1xq2FkgcChtng\nZvVyjIbKln6Md1fiobx2H6MJMJRzME4/bj4krIilKazTzwXdSKcsF/wJu+590IqO\nske18Xqxgbv5VOS3TeLewfRfKeySbVtP9eEMb+P0/yuXUBMeHLBAFO9x0QKBgCGY\nTBlDPVxa8EFdNfTqPrL1cc4sb8FWB/8mp/It9tjJoMED59tCJtRx28Y+nyfS+WrR\nJhHaaU1YdvP66tBllkWbNrfkNEW8QCPsK7GI2csFa99RNG6vGXj+suWqqkRfBDpD\n/675N3Ffc5S6XkkvDQbpxYhTqiZKI3gtg0CddHIxAoGBAIZWqJsdALiQCHW0MR3f\nyWInb0BagSeYejU/lHC3Hk7BP0onJ1aR4TiFyImG3WqA0Jx5RG0RDwrjNE8lB50t\nXBvgqpztuEggxP0nCQZ6jcqqSotElH65rjLNRcUoEcD9XhrG+2/fQLlepfsJrrwE\nkusu1Y/rHUdDR706J7KlWFJD\n-----END PRIVATE KEY-----\n",
    client_email:
      "firebase-adminsdk-7qwai@chatbotexemple-f3ddb.iam.gserviceaccount.com",
    client_id: "116368881089134413469",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url:
      "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-7qwai%40chatbotexemple-f3ddb.iam.gserviceaccount.com",
  }),
});

// ----------------------- API KEY openweathermap -------------------------
var api_key_weather = "xxxx";
// ----------------------- PARAMETRES DU SERVEUR -------------------------
const PORT = process.env.PORT || 5000;
// Wit.ai parameters
const WIT_TOKEN = "VQV3FCX7USTVOZ27FZNXPBR6QKDHVJIQ"; // saisir ici vos informations (infos sur session XX)
// Messenger API parameters
const FB_PAGE_TOKEN =
  "EAAJ6aWA2o9oBAHD6H5qMpTJCuRDn5BwcfCNhs9ZCSBMOAq2jaQs0iu0Twnv1spDp13noS9EK9yVhRiICUd0taew7JZATr5854GakYKoBlAIH3JA0BD7fM4kL8kTS2Az0ryn6OZB2lsO7LFCZBkYZC4RG0RAOjrZBO74uqTYziv530xwPf2jJbkAvLlOeia9D0n4j01RrUyhAZDZD"; // saisir ici vos informations (infos sur session XX)
if (!FB_PAGE_TOKEN) {
  throw new Error("missing FB_PAGE_TOKEN");
}
const FB_APP_SECRET = "f86125ae05dd71b97759bcd12dae8b65"; // saisir ici vos informations (infos sur session XX)
if (!FB_APP_SECRET) {
  throw new Error("missing FB_APP_SECRET");
}
let FB_VERIFY_TOKEN = "azerty1"; // saisir ici vos informations (infos sur session XX)
crypto.randomBytes(8, (err, buff) => {
  if (err) throw err;
  FB_VERIFY_TOKEN = buff.toString("hex");
  console.log(`/webhook will accept the Verify Token "${FB_VERIFY_TOKEN}"`);
});
// ----------------------- FONCTION POUR VERIFIER UTILISATEUR OU CREER ----------------------------
var checkAndCreate = (fbid, prenom, nom, genre) => {
  var userz = firebase
    .database()
    .ref()
    .child("accounts")
    .orderByChild("fbid")
    .equalTo(fbid)
    .once("value", function (snapshot) {
      admin
        .auth()
        .createCustomToken(fbid)
        .then(function (customToken) {
          firebase
            .auth()
            .signInWithCustomToken(customToken)
            .then(function () {
              //inserer notre compte
              var user2 = firebase.auth().currentUser;
              var keyid = firebase.database().ref().child("accounts").push();
              firebase
                .database()
                .ref()
                .child("accounts")
                .child(keyid.key)
                .set({
                  fbid: fbid,
                  prenom: prenom,
                  nom: nom,
                  genre: genre,
                  date: new Date().toISOString(),
                })
                .catch(function (error2) {
                  console.log(error2);
                });
            })
            .catch(function (error) {
              // Handle Errors here.
              var errorCode = error.code;
              var errorMessage = error.message;
            });
        })
        .catch(function (error3) {
          console.log("Erreur : " + error3);
        });
    });
};
// ------------------------ FONCTION DEMANDE INFORMATIONS USER -------------------------
var requestUserName = (id) => {
  var qs = "access_token=" + encodeURIComponent(FB_PAGE_TOKEN);
  return fetch(
    "https://graph.facebook.com/v2.8/" + encodeURIComponent(id) + "?" + qs
  )
    .then((rsp) => rsp.json())
    .then((json) => {
      if (json.error && json.error.message) {
        throw new Error(json.error.message);
      }
      return json;
    });
};
// ------------------------- ENVOI MESSAGES SIMPLES ( Texte, images, boutons génériques, ...) -----------
var fbMessage = (id, data) => {
  var body = JSON.stringify({
    recipient: {
      id,
    },
    message: data,
  });
  console.log("BODY" + body);
  var qs = "access_token=" + encodeURIComponent(FB_PAGE_TOKEN);
  return fetch("https://graph.facebook.com/me/messages?" + qs, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body,
  })
    .then((rsp) => rsp.json())
    .then((json) => {
      if (json.error && json.error.message) {
        console.log(
          json.error.message +
            " " +
            json.error.type +
            " " +
            json.error.code +
            " " +
            json.error.error_subcode +
            " " +
            json.error.fbtrace_id
        );
      }
      return json;
    });
};
// ----------------------------------------------------------------------------
const sessions = {};
// ------------------------ FONCTION DE CREATION DE SESSION ---------------------------
var findOrCreateSession = (fbid) => {
  let sessionId;
  Object.keys(sessions).forEach((k) => {
    if (sessions[k].fbid === fbid) {
      sessionId = k;
    }
  });
  if (!sessionId) {
    sessionId = new Date().toISOString();
    sessions[sessionId] = {
      fbid: fbid,
      context: {},
    };
    requestUserName(fbid)
      .then((json) => {
        sessions[sessionId].name = json.first_name;
        checkAndCreate(fbid, json.first_name, json.last_name, json.gender);
      })
      .catch((err) => {
        console.error("Oops! Il y a une erreur : ", err.stack || err);
      });
  }
  return sessionId;
};
// ------------------------ FONCTION DE RECHERCHE D'ENTITES ---------------------------
var firstEntityValue = function (entities, entity) {
  var val =
    entities &&
    entities[entity] &&
    Array.isArray(entities[entity]) &&
    entities[entity].length > 0 &&
    entities[entity][0].value;
  if (!val) {
    return null;
  }
  return typeof val === "object" ? val.value : val;
};
// ------------------------ LISTE DE TOUTES VOS ACTIONS A EFFECTUER ---------------------------

var actions = {
  // fonctions genérales à définir ici
  send({ sessionId }, response) {
    const recipientId = sessions[sessionId].fbid;
    if (recipientId) {
      if (response.quickreplies) {
        response.quick_replies = [];
        for (var i = 0, len = response.quickreplies.length; i < len; i++) {
          response.quick_replies.push({
            title: response.quickreplies[i],
            content_type: "text",
            payload: response.quickreplies[i],
          });
        }
        delete response.quickreplies;
      }
      return fbMessage(recipientId, response)
        .then(() => null)
        .catch((err) => {
          console.log("Je send" + recipientId);
          console.error("Oops! erreur ", recipientId, ":", err.stack || err);
        });
    } else {
      console.error("Oops! utilisateur non trouvé : ", sessionId);
      return Promise.resolve();
    }
  },
  envoyer_message_text(sessionId, context, entities, text) {
    const recipientId = sessions[sessionId].fbid;
    var response = {
      text: text,
    };
    return fbMessage(recipientId, response)
      .then(() => {})
      .catch((err) => {
        console.log("Erreur envoyer_message_text" + recipientId);
      });
  },
  reset_context(entities, context, sessionId) {
    console.log("Je vais reset le context" + JSON.stringify(context));
    return new Promise(function (resolve, reject) {
      context = {};
      return resolve(context);
    });
  },
};
// --------------------- CHOISIR LA PROCHAINE ACTION (LOGIQUE) EN FCT DES ENTITES OU INTENTIONS------------
function choisir_prochaine_action(sessionId, context, entities) {
  // ACTION PAR DEFAUT CAR AUCUNE ENTITE DETECTEE
  if (Object.keys(entities).length === 0 && entities.constructor === Object) {
  }
  // PAS DINTENTION DETECTEE
  if (!entities.intent) {
  }
  // IL Y A UNE INTENTION DETECTION : DECOUVRONS LAQUELLE AVEC UN SWITCH
  else {
    switch (entities.intent && entities.intent[0].value) {
      case "Dire_Bonjour":
        actions.envoyer_message_text(
          sessionId,
          context,
          entities,
          "Bonjour mon cher utilisateur !"
        );
        break;
    }
  }
}

// --------------------- FONCTION POUR AFFICHER LA METEO EN FCT DE LA LAT & LNG ------------

// --------------------- LE SERVEUR WEB ------------
const wit = new Wit({
  accessToken: WIT_TOKEN,
  actions,
  logger: new log.Logger(log.INFO),
});
const app = express();
app.use(({ method, url }, rsp, next) => {
  rsp.on("finish", () => {
    console.log(`${rsp.statusCode} ${method} ${url}`);
  });
  next();
});
app.use(
  bodyParser.json({
    verify: verifyRequestSignature,
  })
);
// ------------------------- LE WEBHOOK / hub.verify_token à CONFIGURER AVEC LE MEME MOT DE PASSE QUE FB_VERIFY_TOKEN ------------------------
app.get("/webhook", (req, res) => {
  if (
    req.query["hub.mode"] === "subscribe" &&
    req.query["hub.verify_token"] === "azerty1"
  ) {
    // remplir ici à la place de xxxx le meme mot de passe que FB_VERIFY_TOKEN
    res.send(req.query["hub.challenge"]);
  } else {
    res.sendStatus(400);
  }
});
// ------------------------- LE WEBHOOK / GESTION DES EVENEMENTS ------------------------
app.post("/webhook", (req, res) => {
  const data = req.body;
  if (data.object === "page") {
    data.entry.forEach((entry) => {
      entry.messaging.forEach((event) => {
        if (event.message && !event.message.is_echo) {
          var sender = event.sender.id;
          var sessionId = findOrCreateSession(sender);
          var { text, attachments, quick_reply } = event.message;

          function hasValue(obj, key) {
            return obj.hasOwnProperty(key);
          }
          console.log(JSON.stringify(event.message));
          // -------------------------- MESSAGE IMAGE OU GEOLOCALISATION ----------------------------------
          if (
            event.message.attachments != null &&
            typeof event.message.attachments[0] != "undefined"
          ) {
            // envoyer à Wit.ai ici
          }
          // --------------------------- MESSAGE QUICK_REPLIES --------------------
          else if (
            hasValue(event.message, "text") &&
            hasValue(event.message, "quick_reply")
          ) {
            // envoyer à Wit.ai ici
          }
          // ----------------------------- MESSAGE TEXT ---------------------------
          else if (hasValue(event.message, "text")) {
            // envoyer à Wit.ai ici
            wit
              .message(text, sessions[sessionId].context)
              .then(({ entities }) => {
                choisir_prochaine_action(
                  sessionId,
                  sessions[sessionId].context,
                  entities
                );
                console.log(
                  "Yay, on a une response de Wit.ai : " +
                    JSON.stringify(entities)
                );
              })
              .catch(console.error);
          }
          // ----------------------------------------------------------------------------
          else {
            // envoyer à Wit.ai ici
          }
        }
        // ----------------------------------------------------------------------------
        else if (event.postback && event.postback.payload) {
          var sender = event.sender.id;
          var sessionId = findOrCreateSession(sender);
          // envoyer à Wit.ai ici
        }
        // ----------------------------------------------------------------------------
        else {
          console.log("received event : ", JSON.stringify(event));
        }
      });
    });
  }
  res.sendStatus(200);
});
// ----------------- VERIFICATION SIGNATURE -----------------------
function verifyRequestSignature(req, res, buf) {
  var signature = req.headers["x-hub-signature"];
  if (!signature) {
    console.error("Couldn't validate the signature.");
  } else {
    var elements = signature.split("=");
    var method = elements[0];
    var signatureHash = elements[1];
    var expectedHash = crypto
      .createHmac("sha1", FB_APP_SECRET)
      .update(buf)
      .digest("hex");
    if (signatureHash != expectedHash) {
      throw new Error("Couldn't validate the request signature.");
    }
  }
}
app.listen(PORT);
console.log("Listening on :" + PORT + "...");
