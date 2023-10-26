import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart'
    show debugDefaultTargetPlatformOverride;
import 'package:flutter/services.dart';
import 'package:nstw/components/LoginComponent.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'dart:convert';
import 'dart:ui';


class RegisterLayout extends StatefulWidget{

    RegisterLayout({Key? key}) : super(key: key);

    @override
    _RegisterLayout createState() {
       return new _RegisterLayout();
    }

}

class _RegisterLayout extends State<RegisterLayout>{

    String fullname = '';
    String email = '';
    String password = '';

    @override
    initState() {        
        super.initState();          

    }

    void setFullname(String val){
        setState((){
            fullname = val;
        });
    }

    void setEmail(String val){
        setState((){
            email = val;
        });
    }

    void setPass(String val){
        setState((){
            password = val;
        });
    }

    @override
    Widget build(BuildContext context) {

        return SafeArea(
            child: Column(
                children: [
                    Container(
                        margin: EdgeInsets.symmetric(vertical: 20.0),
                        child: Text("Your CARGHA \n  Vehicle Tracking", textAlign: TextAlign.center, style: TextStyle(fontSize: 27.0))
                    ),  
                    Container(
                        margin: EdgeInsets.symmetric(horizontal: 20.0, vertical: 10.0),
                        child:  TextField(                                      
                          textInputAction: TextInputAction.done,
                          decoration: InputDecoration(
                            filled: true,
                            fillColor: Color(0x62FFFFFF),
                            hintText: 'Fullname',
                            labelText: 'Fullname',
                            border: new OutlineInputBorder(
                                borderRadius: BorderRadius.all(Radius.circular(10)),
                                borderSide: BorderSide(width: 1, color: Color(0xFFFFFFFF))
                            ),
                            focusedBorder: OutlineInputBorder(
                                borderRadius: BorderRadius.all(Radius.circular(10)),
                                borderSide: BorderSide(width: 1, color: Colors.lightBlue),
                            ),
                            labelStyle: TextStyle(
                              color: Colors.lightBlue
                            ),
                            contentPadding: const EdgeInsets.symmetric(horizontal: 10.0),
                          ),
                          style: TextStyle(
                              fontSize: 17.0,
                              color: Colors.black
                           ),
                           onChanged: (text) {                                 
                                setFullname(text);
                           }
                        )
                    ),
                    Container(
                        margin: EdgeInsets.symmetric(horizontal: 20.0, vertical: 10.0),
                        child:  TextField(                                      
                          textInputAction: TextInputAction.done,
                          decoration: InputDecoration(
                            filled: true,
                            fillColor: Color(0x62FFFFFF),
                            hintText: 'Email',
                            labelText: 'Email',
                            border: new OutlineInputBorder(
                                borderRadius: BorderRadius.all(Radius.circular(10)),
                                borderSide: BorderSide(width: 1, color: Color(0xFFFFFFFF))
                            ),
                            focusedBorder: OutlineInputBorder(
                                borderRadius: BorderRadius.all(Radius.circular(10)),
                                borderSide: BorderSide(width: 1, color: Colors.lightBlue),
                            ),
                            labelStyle: TextStyle(
                              color: Colors.lightBlue
                            ),
                            contentPadding: const EdgeInsets.symmetric(horizontal: 10.0),
                          ),
                          style: TextStyle(
                              fontSize: 17.0,
                              color: Colors.black
                           ),
                           onChanged: (text) {                                 
                                setEmail(text);
                           }
                        )
                    ),
                    Container(
                        margin: EdgeInsets.symmetric(horizontal: 20.0, vertical: 10.0),
                        child:  TextField(     
                          obscureText: true,                                 
                          textInputAction: TextInputAction.done,
                          decoration: InputDecoration(
                            filled: true,
                            fillColor: Color(0x62FFFFFF),
                            hintText: 'Password',
                            labelText: 'Password',
                            border: new OutlineInputBorder(
                                borderRadius: BorderRadius.all(Radius.circular(10)),
                                borderSide: BorderSide(width: 1, color: Color(0xFFFFFFFF))
                            ),
                            focusedBorder: OutlineInputBorder(
                                borderRadius: BorderRadius.all(Radius.circular(10)),
                                borderSide: BorderSide(width: 1, color: Colors.lightBlue),
                            ),
                            labelStyle: TextStyle(
                              color: Colors.lightBlue
                            ),
                            contentPadding: const EdgeInsets.symmetric(horizontal: 10.0),
                          ),
                          style: TextStyle(
                              fontSize: 17.0,
                              color: Colors.black
                           ),
                           onChanged: (text) {                                 
                                setPass(text);
                           }
                        )
                    ),
                    Container(                                        
                        child: ElevatedButton(                                                    
                            child: Padding(
                                    padding: EdgeInsets.symmetric(horizontal: 20.0),
                                    child: Text("Submit", style : TextStyle(fontSize: 17.0, color : Colors.white, fontWeight : FontWeight.w300)
                                )
                            ),           
                            onPressed: () {                                                         
                                                            
                            }
                        )
                    )
                ]
            )
        );
    }

}