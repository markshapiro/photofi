Mobile App to browse live photos of events (Parties, Weddings etc.) and upload from your own professional camera using wireless LAN card that fetches photos from device to mobile app.

Can be downloaded at [`google play`](https://play.google.com/store/apps/details?id=com.photofi.app)
and [`appstore`](https://itunes.apple.com/us/app/photofi/id1200587486?mt=8)

Built with React.js & Redux with Cordova for mobile, Node.js & MongoDB on server.

#### Customer flow: (trivial)

1) logs in with facebook or regular login

2) enters event invitation code textually or by scanning QR code

3) enters event photo feed that polls for updates, can share photos with friends.

#### Photographer flow: (more interesting)

1) enters event like regular customer

2) connects to wireless card network containing camera photos

3) lists all photos and selects photos he wants to upload

4) selects his logo image to add under each photo

5) photos are shrinked to reduce size, logo attached, and result is uploaded as Base64

[`link to code`](https://github.com/markshapiro/photofi/blob/master/ui/src/actions/events.js#L71)

[`link to code`](https://github.com/markshapiro/photofi/blob/master/server/server/controllers/event.js#L93)
