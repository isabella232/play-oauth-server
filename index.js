const http = require('http')
const https = require('https')
const url = require('url')
const port = 4001
const GITHUB_CLIENT = process.env.GITHUB_CLIENT
const GITHUB_SECRET = process.env.GITHUB_SECRET

function httpsRequest(params) {
  return new Promise( (resolve, reject) => {
        https.get(params, (res) => {

           if (res.statusCode < 200 || res.statusCode >= 300) {
              return reject(new Error('statusCode=' + res.statusCode));
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
  });
}


http.createServer( (req, res) => {

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
        res.setHeader('Content-Type', 'application/json;charset=utf-8');
        await res.end(data)
      })
      
    }else{
       res.setHeader('Content-Type', 'application/json;charset=utf-8');
       res.end(`{"error": "${http.STATUS_CODES[404]}"}`)
    }
  }else {
  // End all the other connections
  res.setHeader('Content-Type', 'application/json;charset=utf-8');
  res.end(`{"error": "${http.STATUS_CODES[404]}"}`)
  }
}).listen(port, () => {
  console.log(`Server Listening on port: ${port}`);
})
