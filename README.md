Mobile app to browse live photos of event (party, wedding, etc) and upload photos from his personal camera device using wireless card.

Can be downloaded at [`google play`](https://play.google.com/store/apps/details?id=com.photofi.app)
and [`appstore`](https://itunes.apple.com/us/app/photofi/id1200587486?mt=8)

Built with React.js & Redux with Cordova for mobile, Node.js & MongoDB on server. (does not include cordova project)

#### Customer flow: (trivial)

1) logs in with facebook or regular login

2) enters event invitation code textually or by scanning QR code

3) enters event photo feed that polls for updates, can share photos with friends.

#### Photographer flow: (more interesting)

1) enters event like regular customer

2) connects to wireless lan card (FlashAir™) containing camera photos

3) lists all photos and selects photos he wants to upload

4) selects his logo image to add under each photo

5) photos are shrinked to reduce size, logo attached, and result is uploaded as Base64
[`link to photo upload code`](https://github.com/markshapiro/photofi/blob/master/server/server/controllers/event.js#L93)
