import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';

class SharedComponent{

	Widget appBar2(GlobalKey<ScaffoldState> drawerKey){

        return Container(
            decoration: BoxDecoration(color: Colors.lightBlue),
            padding: EdgeInsets.symmetric(vertical: 10.0),
            child : Column(
              mainAxisAlignment : MainAxisAlignment.center,
              children : [
                Container(
                    child: Row(
                        children: [
                            Container(
                                child: IconButton(
                                    icon: const Icon(Icons.menu),                     
                                    onPressed: () { 
                                        drawerKey.currentState?.openDrawer();
                                    }                                        
                                )
                            ),
                            Flexible(
                                child: Row(
                                    mainAxisAlignment : MainAxisAlignment.start,          
                                    children:[
                                        Text("CarGHA", textAlign: TextAlign.left, style: TextStyle(fontSize: 27.0, color: Colors.white)),                                        
                                    ]
                                )
                            )                
                        ]
                    )
                )
              ]
            )
        );

    }
    
}