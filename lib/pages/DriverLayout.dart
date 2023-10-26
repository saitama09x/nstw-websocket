import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart'
    show debugDefaultTargetPlatformOverride;
import 'package:flutter/services.dart';
import 'dart:async';
import 'dart:convert';
import 'package:nstw/pages/MapLayout.dart';

class DriverLayout extends StatefulWidget{

    DriverLayout({Key? key}) : super(key: key);

    @override
    _DriverLayout createState() {
       return new _DriverLayout();
    }

}

class _DriverLayout extends State<DriverLayout> with SingleTickerProviderStateMixin {

    final GlobalKey<ScaffoldState> navigatorKey = new GlobalKey();

    @override
    initState() {
        super.initState();

    }


    Widget build(BuildContext context) {

        return Scaffold(
            key : navigatorKey,
            body: SafeArea(
                child: Column(
                    children: [
                        Container(
                            margin: EdgeInsets.only(bottom: 20.0),
                            child: Text("Select Your Vehicle", textAlign: TextAlign.center, style: TextStyle(fontSize: 20.0, fontWeight: FontWeight.bold))
                        ),
                        Container(
                            margin: EdgeInsets.only(bottom: 20.0, left: 20.0, right: 20.0),
                            child: Row(
                                children: [
                                    Expanded(
                                        child: ElevatedButton(  
                                            style: ElevatedButton.styleFrom(
                                                primary: Colors.blue,
                                              ),                                              
                                            onPressed: () {                                      
                                                 Navigator.push(context, MaterialPageRoute(builder: (context) => MapLayout(driverName: "driver_1")));
                                              },
                                            child: Text('Driver 1', style: TextStyle(color: Colors.black))
                                        )
                                    )                                    
                                ]
                            )
                        ),
                        Container(
                            margin: EdgeInsets.only(bottom: 20.0, left: 20.0, right: 20.0),
                            child: Row(
                                children: [
                                    Expanded(
                                        child: ElevatedButton(  
                                            style: ElevatedButton.styleFrom(
                                                primary: Colors.blue,
                                              ),                                              
                                            onPressed: () { 
                                                 Navigator.push(context, MaterialPageRoute(builder: (context) => MapLayout(driverName: "driver_2")));
                                              },
                                            child: Text('Driver 2', style: TextStyle(color: Colors.black))
                                        )
                                    )
                                ]
                            )
                        ),
                        Container(
                            margin: EdgeInsets.only(bottom: 20.0, left: 20.0, right: 20.0),
                            child: Row(
                                children: [
                                    Expanded(
                                        child: ElevatedButton(  
                                            style: ElevatedButton.styleFrom(
                                                primary: Colors.blue,
                                              ),                                              
                                            onPressed: () { 
                                                 Navigator.push(context, MaterialPageRoute(builder: (context) => MapLayout(driverName: "driver_3")));
                                              },
                                            child: Text('Driver 3', style: TextStyle(color: Colors.black))
                                        )
                                    )
                                ]
                            )
                        )
                    ]
                )
            )

        );

    }

}