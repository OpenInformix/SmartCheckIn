
## DB Setup

### database connection info
```bash
cd SmartCheckIn/server
cp SampleConfig.json MyConfig.json

# update MyConfig.json with connectivity information to your database.
udate MyConfig.json
```


### Docker Connection Info
```bash
# ls -l /opt/ibm/data/log/informix.log
"SERVER=informix;DATABASE=db1;HOST=192.168.238.3;SERVICE=9099;PROTOCOL=onsoctcp;UID=informix;PWD=mypwd123;"
```

### Tales
```bash
dbaccess db1 <<EOF
DROP TABLE passengers2;
CREATE TABLE passengers2 (
 id  SERIAL,  name char(20) PRIMARY KEY, img LVARCHAR(32739) );

INSERT INTO passengers2 (name, img) VALUES ('test1', 'my test img1 base64 string-1');
SELECT * FROM passengers2 WHERE name  = 'test1'
EOF
```


### ML functions
```sql
dbaccess db1 <<EOF
drop function sqlAddNewPassenger;
drop function sqlVerifyPassenger;
drop function sqlMLClose;
drop function sqlSetConStrBuff;
EOF


dbaccess db1 <<EOF
create function sqlAddNewPassenger (integer, lvarchar, lvarchar) returning lvarchar;
external name '/opt/ibm/myudr/wsBlade1.bld(CAddNewPassenger)' language c;
create function sqlMLClose () returning integer;
external name '/opt/ibm/myudr/wsBlade1.bld(CwsMLClose)' language c;
create function sqlVerifyPassenger (integer, lvarchar, lvarchar) returning lvarchar;
external name '/opt/ibm/myudr/wsBlade1.bld(CVerifyPassenger)' language c;
create function sqlSetConStrBuff (lvarchar) returning integer;
external name '/opt/ibm/myudr/wsBlade1.bld(CSetConStrBuff)' language c;
EOF


dbaccess db1 <<EOF
SELECT * FROM passengers2;
-- truncate table passengers2
EOF

dbaccess db1 <<EOF
execute function sqlSetConStrBuff( 'ws://192.168.238.3:8080' );
EOF


-- Call the function
execute function sqlAddNewPassenger( 103, 'test1', 'This is test string2');
execute function sqlMLClose();
execute function sqlSetConStrBuff( 'ws://192.168.238.3:8080' );

# chown informix:informix /opt/ibm/myudr/wsBlade1.bld
# chmod 500 /opt/ibm/myudr/wsBlade1.bld
```





```bash
# incase of firewall problem shutdown it and try once and bring it up
sudo systemctl stop firewalld.service
# do the test, then bring it up
sudo systemctl start firewalld.service
```

