import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart'
    show debugDefaultTargetPlatformOverride;
import 'package:flutter/services.dart';
import 'package:socket_io_client/socket_io_client.dart' as IO;
import 'dart:convert';


class AlertSocket{     

      IO.Socket socket  = IO.io("http://10.0.2.2:3001/drivers", <String, dynamic>{
         'autoConnect': true,
         'transports': ['websocket'],       
      });

       AlertSocket(){
        try {
                
              socket.connect();
              socket.onConnect((_) {
                print('Connection established');
              });
              
              socket.onDisconnect((_) => print('Connection Disconnection'));
              socket.onConnectError((err) => print(err));
              socket.onError((err) => print(err));

          }catch (e) {
              print(e.toString());
          }
     }     

     void socket_disconnect(){
        socket.disconnect();
     }

     bool is_disconnected(){
        return socket.disconnected;
     }

     void socket_reconnect(){
        try{
          socket.connect();
          socket.onConnect((_) {
            print('Connection established');
          });
        }catch(e){
            print(e);
        }
     }

     void check_active(String driverName, Map<String, dynamic> latlng){            
          socket.on('check_active', (msg) {
             if(msg != null){
                 socket.emit("web", {
                    'type': 'is_active',
                    'data': {
                        "driver": driverName,
                        "position": latlng
                    }
                });                 
             }
          });
     }

     void check_avatar(String driverName){            
          socket.on('check_avatar', (msg) {
             if(msg != null){
                 socket.emit("web", {
                    'type': 'check_avatar',
                    'data': {
                        "driver": driverName,                        
                    }
                });                 
             }
          });
     }

     void signal_active(String driverName, Map<String, dynamic> latlng){
        socket.emit("web", {
            'type': 'is_active',
            'data': {
                "driver": driverName,
                "position": latlng
            }
        });
     }

     void signal_logout(String driverName){
        socket.emit("web", {
            'type': 'logout',
            'data': {
                "driver": driverName                
            }
        });
     }

     void signal_offline_icon(String driverName){
        socket.emit("web", {
            'type': 'offline_icon',
            'data': {
                "driver": driverName                
            }
        });
     }

     void socket_send_route(String driverName, Map<String, dynamic> position){        
        socket.emit("web", {
            'type': 'location',
            'data': {
                'driver': driverName,
                'position': position
            }
        });    
     }

}