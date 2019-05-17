##### AUTHORIZED 1 --> MASTER 
```
AUTH=true MASTER=6001 npm start
```
#### AUTHORIZED 2
```
AUTH=true MASTER=6001 HTTP_PORT=3002 P2P_PORT=6002 PRIVATE_KEY=75d8efd17cc4e21934e9b084cdde851f457377e0d6eff18cf65eb7a31c38a778 npm start
```
#### AUTHORIZED 3
```
AUTH=true MASTER=6001 HTTP_PORT=3003 P2P_PORT=6003 PRIVATE_KEY=75d8efd17cc4e21934e9b084cdde851f457377e0d6eff18cf65eb7a31c38a776 npm start
```

#### NON-AUTHORIZED 1
```
MASTER=6001 HTTP_PORT=3004 P2P_PORT=6004 PRIVATE_KEY=75d8efd17cc4e21934e9b084cdde851f457377e0d6eff18cf65eb7a31c38a775 npm start
```

#### NON-AUTHORIZED 2
```
MASTER=6001 HTTP_PORT=3005 P2P_PORT=6005 PRIVATE_KEY=75d8efd17cc4e21934e9b084cdde851f457377e0d6eff18cf65eb7a31c38a774 npm start
```

#### Send transaction
```
curl -H "Content-type: application/json" --data '{"address": "04f04ba012ac1a1f7c195dce22dab29c915721bfaccc0ee8e895505ef1fb22971b13c85dc0108bad29c4d72c3eb31854c684128c6332a54450c729187c6faaa698", "amount" : 35}' http://localhost:3002/sendTransaction
```


#### Mine transaction
```
curl -H "Content-type: application/json" --data '{"address": "04f04ba012ac1a1f7c195dce22dab29c915721bfaccc0ee8e895505ef1fb22971b13c85dc0108bad29c4d72c3eb31854c684128c6332a54450c729187c6faaa698", "amount" : 35}' http://localhost:3002/mineTransaction
```
