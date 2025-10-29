
Sample command to test connectivity 

```
curl --location 'localhost:8888/api/print/commands' \
--header 'Content-Type: application/json' \
--data '{
    "commands": [
        "FEED 900",
        "BACKFEED 900"
    ],
    "options": { "clearBuffer": true, "closeDelayMs": 2000 },
    "printer": { "ipaddress": "192.168.8.169", "port": "9100", "delay": "500" }
}'
```


Sample command to print

```
curl --location 'localhost:8888/api/print/commands' \
--header 'Content-Type: application/json' \
--data '{
    "commands": [
        "TEXT 250,50,\"0\",0,10,10,\"Hello from Fai!\"",
        "TEXT 400,400,\"HKU_MING.TTF\",90,26,26,2,\"Sample 中文中文中文\" \r\n",
        "TEXT 400,400,\"NOTO_STD.TTF\",90,23,23,2,\"Samplze 中文中文中文\" \r\n",        	
        "PRINT 1,1 \r\n"        
    ]
}'
```