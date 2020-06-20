# Play-OAuth-Server

Server to authenticate VCS login for nteract play app. Right now, only Github authentication is supported, but in future other authentication logics for Gitlab and other VCS can be added. Like, endpoint `/github/` is for Github, similarly `/gitlab` endpoint for Gitlab can be used.

> A similar project is OAuth-server used for publishing gist in desktop applications.

# Deployment

```
git clone https://github.com/nteract/play-oauth-server
npm install -g now
now secrets add github_client_id "insert client id here."
now secrets add github_secret "insert secret here."
now -e GITHUB_CLIENT=@github_client_id -e GITHUB_SECRET=@github_secret
```


