
### Create SSL certificate 
```bash
/work/demo/ws/SmartCheckIn/server/cert
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 3650
```


### applicaiton URL
```bash
http://localhost:3000/
# or
https://192.168.238.3:3000/

```


### host only network IP
```bash
ip addr show | grep enp0s8

# output
3: enp0s8: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast state UP group default qlen 1000
    inet 192.168.238.3/24 brd 192.168.238.255 scope global noprefixroute dynamic enp0s8
```

