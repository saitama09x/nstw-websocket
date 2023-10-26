import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart'
    show debugDefaultTargetPlatformOverride;
import 'package:flutter/services.dart';
import 'dart:async';
import 'dart:convert';


class ModalComponent{

    Future<void> display_disclosure(BuildContext context, Function onEnableLocation) async {

        return showDialog<void>(
            context: context,
            barrierDismissible: false, // user must tap button!
            builder: (BuildContext context) {
              return AlertDialog(
                title: Text('Use your location', style : TextStyle(fontWeight : FontWeight.bold)),
                content: const Text('This app collects location data to enable Incident Location and Incident Reporting when this app is open. If the app is closed the collection of location data is disabled.'),
                actions: <Widget>[
                        TextButton(
                          onPressed: (){                            
                            Navigator.of(context).pop();
                          },
                          child: Text('No thanks'),
                        ),
                        TextButton(
                          onPressed: (){                            
                              onEnableLocation();
                          },
                          child: Text('Turn On'),
                        )
                    ]
                );
            }
        );

    }

    Future<void> notif_backgroundserv(BuildContext context) async {

        return showDialog<void>(
            context: context,
            barrierDismissible: false, // user must tap button!
            builder: (BuildContext context) {
              return AlertDialog(
                title: Text('Running in Background', style : TextStyle(fontWeight : FontWeight.bold)),
                content: const Text('Your app is now running in background service'),
                actions: <Widget>[
                        TextButton(
                          onPressed: (){                            
                            Navigator.of(context).pop();
                          },
                          child: Text('Okay'),
                        )                       
                    ]
                );
            }
        );

    }

    Future<void> dest_updated(BuildContext context, String dest) async {

        return showDialog<void>(
            context: context,
            barrierDismissible: false, // user must tap button!
            builder: (BuildContext context) {
              return AlertDialog(
                title: Text('Your destination is now updated', style : TextStyle(fontWeight : FontWeight.bold)),
                content: Text("Your next destination is: " + dest),
                actions: <Widget>[
                        TextButton(
                          onPressed: (){                            
                            Navigator.of(context).pop();
                          },
                          child: Text('Okay'),
                        )                       
                    ]
                );
            }
        );

    }

    Future<void> display_exhibits(BuildContext context, Function onChange) async {

        return showDialog<void>(
            context: context,
            barrierDismissible: false, // user must tap button!
            builder: (BuildContext context) {
              return AlertDialog(
                title: Text('Select your destination', style : TextStyle(fontWeight : FontWeight.bold)),
                content: Column(
                    children: [
                        Container(                                            
                            child: Row(
                              children: [
                                Expanded(
                                    child: ElevatedButton(                                                    
                                        child: Text("Main S&T Exhibits", textAlign: TextAlign.center, style : TextStyle(fontSize: 17.0, color : Colors.white, fontWeight : FontWeight.w300)
                                        ),           
                                        onPressed: () {                                                         
                                            onChange("icc");
                                            Navigator.of(context).pop();
                                        }
                                    )
                                  )
                              ]
                            )
                        ),
                        Container(                                            
                              child: Row(
                                children: [
                                  Expanded(
                                      child: ElevatedButton(                                                    
                                          child: Text("Fibers and Textiles \nS&T Exhibits", textAlign: TextAlign.center, style : TextStyle(fontSize: 17.0, color : Colors.white, fontWeight : FontWeight.w300)
                                          ),           
                                          onPressed: () {                                                         
                                              onChange("hinablon");
                                              Navigator.of(context).pop();
                                          }
                                      )
                                    )                                  
                                ]
                              )
                          ),
                         Container(                                            
                              child: Row(
                                children: [
                                  Expanded(
                                    child: ElevatedButton(                                                    
                                          child: Text("Maritime \nS&T Exhibits", textAlign: TextAlign.center, style : TextStyle(fontSize: 17.0, color : Colors.white, fontWeight : FontWeight.w300)
                                          ),           
                                          onPressed: () {                                                         
                                              onChange("maritime");
                                              Navigator.of(context).pop();
                                          }
                                      )
                                  )
                                ]
                              ) 
                          )
                    ]
                ),
                actions: <Widget>[                        
                        TextButton(
                          onPressed: (){                            
                              Navigator.of(context).pop();
                          },
                          child: Text('Close'),
                        )
                    ]
                );
            }
        );

    }

}