### Smart Check-In

### setup
```bash
# one time setup
git clone https://github.com/OpenInformix/SmartCheckIn.git
cd SmartCheckIn

npm install
```


### database connection info
```bash
cd SmartCheckIn/server
cp SampleConfig.json MyConfig.json

# update MyConfig.json with connectivity information to your database.
udate MyConfig.json
```

### Start the application web server
```bash
cd SmartCheckIn
node server/server.js
```
