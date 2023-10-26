import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart'
    show debugDefaultTargetPlatformOverride;

import 'package:nstw/components/DrawerScreen.dart';
import 'package:nstw/components/SharedComponent.dart';
import 'package:nstw/components/FormFieldComponent.dart';
import 'package:nstw/services/firebase-services.dart';
import 'package:flutter/services.dart';
import 'dart:async';
import 'dart:convert';
import 'dart:io';


class ProfileLayout extends StatefulWidget{

    String driverName;

    ProfileLayout({Key? key, this.driverName = ""}) : super(key: key);

    @override
    _ProfileLayout createState() {
       return new _ProfileLayout();
    }

}


class _ProfileLayout extends State<ProfileLayout> {

    final FormFieldComponent form = new FormFieldComponent();
    final DrawerScreen drawer = new DrawerScreen();
    final SharedComponent sharecom = new SharedComponent();
    final GlobalKey<ScaffoldState> navigatorKey = new GlobalKey();
    final FireBaseServ fireserv = new FireBaseServ();
    Map<String, dynamic> profile = {};

    late TextEditingController _email = TextEditingController(text: '');
    late TextEditingController _fullname = TextEditingController(text: '');    

    String email_str = "";
    String fullname_str = "";
    bool is_submitting = false;

    @override
    initState() {
        super.initState();  
         if(mounted){
            fireserv.single_profile(widget.driverName).then((Map<String, dynamic> res){
                if(res.isNotEmpty){
                    _email.text = res['email'];
                    _fullname.text = res['fullname'];

                    setState((){
                        profile = res;
                    });
                }
            });
         }
    }

    void onFname(String val){
        setState((){
            fullname_str = val;
        });
    }

    void onEmail(String val){
        setState((){
            email_str = val;
        });
    }

    void onSubmit(){

        Map<String, dynamic> data = {
            'email': _email.text,
            'fullname': _fullname.text
        };

        setState((){
            is_submitting = true;
        });

        fireserv.update_profile(data, widget.driverName).then((bool res){
            setState((){
                is_submitting = false;
            });
        });

    }

    Widget build(BuildContext context) {

        return Scaffold(
            key : navigatorKey,
            drawer : drawer.init(context, profile),
            body: SafeArea(
                child: Column(
                    children: [
                        sharecom.appBar2(navigatorKey),
                        Expanded(
                            child : ListView(
                                children : [
                                    Container(
                                        margin : EdgeInsets.only(top : 40.0, bottom: 10.0),
                                        child : Text("Update Profile", textAlign: TextAlign.center, style: TextStyle(fontSize : 23.0, fontWeight : FontWeight.bold))
                                    ),
                                    Container(
                                        padding: EdgeInsets.symmetric(horizontal: 20.0),
                                        child: form.InputEditField(context, "FullName", _fullname, onFname)
                                    ),
                                    Container(
                                        padding: EdgeInsets.symmetric(horizontal: 20.0),
                                        child: form.InputEditField(context, "Email", _email, onEmail)
                                    ),
                                    Container(
                                        padding : EdgeInsets.symmetric( horizontal : 20.0),
                                        margin: EdgeInsets.only(top: 20.0, bottom: 10.0),
                                        child : Row(
                                            mainAxisAlignment : MainAxisAlignment.center,
                                            children : [
                                                Expanded(
                                                    child : ElevatedButton(                                                                        
                                                        child: Text(
                                                           "Update", style : TextStyle(fontSize: 20.0, color : Colors.white, fontWeight : FontWeight.w300)
                                                        ), 
                                                        onPressed: () {
                                                            onSubmit();
                                                        }
                                                    )
                                                )
                                            ]
                                        )
                                    ),
                                    Container(
                                        child: (is_submitting) ? Text("Please wait...", textAlign: TextAlign.center): Text("")
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