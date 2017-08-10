# beardude_event

Beardude Event Web App : 用來管理單車比賽的賽制及流程，提供賽事管理介面以及選手報名與成績管理的 REACT WEB APP。

Model:
![beardude event model1](https://cloud.githubusercontent.com/assets/6611716/26103132/a9dfc154-3a6a-11e7-86ac-3175496962db.jpg)

安裝與執行

> npm i

> npm run start

===

DEV (need two screen):

one screen (API)
> sail lift

the other (frontend)
> npm start (enter rs if reload fail or seems strange)

GO TO http://localhost:3030/

===

PRODUCTION (unstable):

one screen (API)
> npm run build
> npm run server

the other (frontend)
> npm run dev (enter rs if reload fail or seems strange)

GO TO http://localhost:3030/

===

PRODUCTION DEBUG MODE

one screen (API)
> npm run build
> DEBUG=express-http-proxy npm run server --> both proxy and connect-history-api-fallback
> DEBUG=true npm run server --> just connect-history-api-fallback

the other (frontend)
> npm run dev (enter rs if reload fail or seems strange)

GO TO http://localhost:3030/

===
Wireframe
![beardude race wireframe ver1](https://user-images.githubusercontent.com/6611716/27020412-b7552d10-4f73-11e7-8c01-3b22ca7f1a7d.jpg)
