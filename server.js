const express = require('express');
const app = express();
const http = require('http');
const { createAdapter, createShardedAdapter } = require("@socket.io/redis-adapter");
const { createClient  } = require('redis')
const { Emitter } = require("@socket.io/redis-emitter");
const redis = require('redis')

const server = http.createServer(app);
const { Server } = require("socket.io");

// const pubClient = createClient({ url: "redis://localhost:6379" });
// const subClient = pubClient.duplicate();

const io = new Server(server, {
  // adapter: createShardedAdapter(pubClient, subClient),
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});


var drivers = io.of("/drivers")

drivers.on("connection", (socket) => {  

  socket.on('web', (data) => {        
      if(data != null){                
          if(data.type == "location"){      
              // pubClient.sendCommand(['LPUSH', "drivers", JSON.stringify(data.data.position)])                      
              // console.log(data.data)
              // emit.to('drivers').emit('drivers', 'hello')                        
              drivers.emit('driver_location', JSON.stringify(data.data))
              drivers.emit('admin_driver_location', JSON.stringify(data.data))
          }
          if(data.type == "check_avatar"){                            
              drivers.emit('online_avatar', JSON.stringify(data.data))              
          }
          else if(data.type == "is_active"){                           
              drivers.emit('active_driver', JSON.stringify(data.data))
              drivers.emit('online_drivers', JSON.stringify(data.data))
              drivers.emit('check_avatar', JSON.stringify(data.data))
              drivers.emit('admin_active_driver', JSON.stringify(data.data))
          }
          else if(data.type == "logout"){  
              drivers.emit('signout_driver', JSON.stringify(data.data))
          }
          else if(data.type == "offline_icon"){
              drivers.emit('offline_icon', JSON.stringify(data.data))  
              drivers.emit('admin_offline_icon', JSON.stringify(data.data))
          }
      }
  })

  socket.on('mobile', (data) => {  
          
      if(data != null){                
          if(data.type == "check_active"){     

              drivers.emit('check_active', JSON.stringify(data.data))                            
          }
          else if(data.type == "check_avatar"){
              drivers.emit('check_avatar', JSON.stringify(data.data))               
          }
      }
  })

})

// app.get('/init-location/:id', async (req, res) => {
      
//   var query = await pubClient.sendCommand(['LINDEX', "1hKQfd8MpQeafnlJWykTAx5vAEn2", '0'])    
//   res.json(query)
  
// })

// Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
//   io.adapter(createAdapter(pubClient, subClient));

//   server.listen(3001, () => {
//     console.log('listening on *:3001');
//   });
// });

server.listen(3001, () => {
  console.log('listening on *:3001');
});

