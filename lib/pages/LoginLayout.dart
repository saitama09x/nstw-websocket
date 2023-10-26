import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart'
    show debugDefaultTargetPlatformOverride;
import 'package:flutter/services.dart';
import 'package:nstw/components/LoginComponent.dart';
import 'package:nstw/services/firebase-services.dart';

import 'package:firebase_auth/firebase_auth.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:nstw/pages/MapLayout.dart';
import 'package:flutter_background_service/flutter_background_service.dart';
import 'package:flutter_background_service_android/flutter_background_service_android.dart';
import 'package:localstorage/localstorage.dart';
import 'dart:convert';
import 'dart:ui';

const List<String> scopes = <String>[
  'email'
];

GoogleSignIn _googleSignIn = GoogleSignIn(
  scopes: scopes,
);

class LoginLayout extends StatefulWidget{
    
    LoginLayout({Key? key}) : super(key: key);

    @override
    _LoginLayout createState() {
       return new _LoginLayout();
    }

}

class _LoginLayout extends State<LoginLayout>{

    final LoginComponent logcom = new LoginComponent();
    final FireBaseServ firebase = new FireBaseServ();
    final LocalStorage storage = new LocalStorage('nstw_app'); 

    bool is_loading = false;
    String username = '';
    String password = '';
    String driver = "Ambulance 1";
    String ambulance = "Ambulance 1";

    bool _isObscure = true;    
    bool _isAuthorized = false;
    bool _isError = false;

    @override
    initState() {        
        super.initState();     

        FirebaseAuth.instance.authStateChanges().listen((User? user) {
            
            if(user == null) {
              _googleSignIn.disconnect();

              FlutterBackgroundService().invoke("stopService");

            } else {

                final name = user.displayName ?? "";
                final email = user.email ?? "";
                final uid = user.uid ?? "";
                final photoUrl = user.photoURL ?? "";
                
                storage.setItem('uid', uid);

                FlutterBackgroundService().isRunning().then((bool res){
                    
                    if(!res){
                        FlutterBackgroundService().startService();        
                    }
                    
                    firebase.check_profile_exists(uid).then((bool res){
                        if(!res){
                            firebase.addUser(context, name, email, uid, photoUrl);
                        }else{
                            Navigator.push(context, MaterialPageRoute(builder: (context) => MapLayout(driverName: uid)));   
                        }                        
                    });                    

                });                                        
            }
        });

        _googleSignIn.signInSilently();

    }

    void onUsername(String val){
        setState((){
            username = val;
        });
    }


    void onPassword(String val){
        setState((){
            password = val;
        });
    }

    void onShowPass(){
        setState(() {
            _isObscure = !_isObscure;
        });
    }


    void onSubmit(BuildContext context){

         Map<String, String> formdata = {
            'username': username,
            'password': password
        };
     
    }

    Future<void> _handleSignIn() async {

          final GoogleSignInAccount? googleSignInAccount = await _googleSignIn.signIn();
          final GoogleSignInAuthentication? googleAuth = await googleSignInAccount?.authentication;              
          final credential = GoogleAuthProvider.credential(
            accessToken: googleAuth?.accessToken,
            idToken: googleAuth?.idToken,
          );          

          
          try{

              final UserCredential userCredential = await FirebaseAuth.instance.signInWithCredential(credential);                
          
          }on FirebaseAuthException catch (e) {
            
            setState((){
                _isError = true;
            });

          }

          // Navigator.push(context, MaterialPageRoute(builder: (context) => MapLayout()));

    }

    Future<void> _handleSignOut() async{

        _googleSignIn.disconnect();

    }

    @override
    Widget build(BuildContext context) {

        return SafeArea(
                child: Column(
                    children : [
                        Container(
                            margin: EdgeInsets.symmetric(vertical: 20.0),
                            child: Text("Your CARGHA \n  Vehicle Tracking", textAlign: TextAlign.center, style: TextStyle(fontSize: 27.0))
                        ),            
                        Container(
                            margin: EdgeInsets.symmetric(horizontal:10.0),                            
                            child: Card(
                                child: Container(
                                    padding: EdgeInsets.symmetric(vertical: 20.0, horizontal: 20.0),
                                    child: Column(
                                        children: [
                                            Container(
                                                margin: EdgeInsets.only(bottom: 10.0),
                                                child: Text("Sign-In", textAlign: TextAlign.center, style: TextStyle(fontSize: 27.0))
                                            ),                                     
                                            Container(                                        
                                                child: ElevatedButton(                                                    
                                                    child: Padding(
                                                            padding: EdgeInsets.symmetric(horizontal: 20.0),
                                                            child: Text("Continue with Google", style : TextStyle(fontSize: 17.0, color : Colors.white, fontWeight : FontWeight.w300)
                                                        )
                                                    ),           
                                                    onPressed: () {                                                         
                                                        _handleSignIn();
                                                    }
                                                )
                                            ),                                                                                        
                                            Container(
                                                child: (_isError) ? Text("Your account is disabled, contact your administrator"): Text("")
                                            )                                            
                                        ]
                                    )
                                )
                            )
                        )                           
                    ]
                )
            );

    }

}