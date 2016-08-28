var HTTPS = require('https');
var cool = require('cool-ascii-faces');

var botID = process.env.BOT_ID;
var offending_word;
var fullstring;
var know_er = "? I hardly know 'er!";

function respond() {
  var request = JSON.parse(this.req.chunks[0]),
      botRegex = /\B(er|ER|eR|Er)\b(?!([?] I hardly know 'er!))/

  if(request.text && botRegex.test(request.text)) {
    var words = request.text.split(" ");
    for (i = 0; i < words.length; i++) {
        if (botRegex.test(words[i])) {
                offending_word = words[i].replace(/[^0-9a-z]/gi, '');
                offending_word = offending_word.replace(/[^0-9a-z]/gi, '');
                break;
        }
    }
    this.res.writeHead(200);
    postMessage();
    this.res.end();
  } else {
    console.log("don't care");
    this.res.writeHead(200);
    this.res.end();
  }
}

function postMessage() {
  var botResponse, options, body, botReq;

  botResponse = cool();

  options = {
    hostname: 'api.groupme.com',
    path: '/v3/bots/post',
    method: 'POST'
  };

    fullstring = offending_word.concat(know_er);

  body = {
    "bot_id" : botID,
    "text" : fullstring
   };

  console.log('sending ' + botResponse + ' to ' + botID);

  botReq = HTTPS.request(options, function(res) {
      if(res.statusCode == 202) {
        //neat
      } else {
        console.log('rejecting bad status code ' + res.statusCode);
      }
  });

  botReq.on('error', function(err) {
    console.log('error posting message '  + JSON.stringify(err));
  });
  botReq.on('timeout', function(err) {
    console.log('timeout posting message '  + JSON.stringify(err));
  });
  botReq.end(JSON.stringify(body));
}


exports.respond = respond;
