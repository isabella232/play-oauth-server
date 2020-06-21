const http = require('http')
const https = require('https')
const url = require('url')
const port = 4001
const GITHUB_CLIENT = process.env.GITHUB_CLIENT
const GITHUB_SECRET = process.env.GITHUB_SECRET

function httpsRequest(params) {
  return new Promise( (resolve, reject) => {
       var req = https.get(params, (res) => {
           if (res.statusCode < 200 || res.statusCode >= 300) {
              console.log(res.url)
              return reject(new Error( res.statusCode));
           } 

           let data = ""
           res.on('data', (chunk) => {
             data += chunk;
           });

           res.on('end', () => {
                console.log('Promise end')
                resolve(data)
           });
     })
    req.on('error', function(err) {
      reject(err)
    })
    req.end()
  });
}


http.createServer( (req, res) => {

  const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
        'Access-Control-Max-Age': 2592000, // 30 days
        'Content-Type': 'application/json;charset=utf-8'
      };

  if (req.url.match(/github/) ){
    const urlQuery =  url.parse(req.url, true).query

    if ( typeof(urlQuery.code) != "undefined" && typeof(urlQuery.state) != "undefined"){
     
      const options = {
       hostname: 'github.com',
        path: "/login/oauth/access_token?client_id=" + GITHUB_CLIENT + "&client_secret=" + GITHUB_SECRET + "&code=" + urlQuery.code + "&state=" + urlQuery.state,
       headers: {
          Accept: 'application/json'
        }
      }

       httpsRequest(options).then( async  (data) => {   
        console.log("data sent")
        console.log(data)
        res.writeHead(200, headers)
        await res.end(data)
       }).catch( (error) => {
          console.log(error)
          res.writeHead(404, headers)
          res.end(`{"error": "Request to github server failed"}`)
       })

    }else{
        res.writeHead(405, headers)
       res.end(`{"error": "${http.STATUS_CODES[405]}"}`)
    }
  }else {
  // End all the other connections
  res.writeHead(405, headers)
  res.end(`{"error": "${http.STATUS_CODES[405]}"}`)
  }
}).listen(port, () => {
  console.log(`Server Listening on port: ${port}`);
})
