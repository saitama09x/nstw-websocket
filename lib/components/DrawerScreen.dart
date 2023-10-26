import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart'
    show debugDefaultTargetPlatformOverride;
import 'package:flutter/services.dart';
import 'dart:async';
import 'package:flutter_background_service/flutter_background_service.dart';
import 'package:flutter_background_service_android/flutter_background_service_android.dart';
import 'package:carp_background_location/carp_background_location.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:localstorage/localstorage.dart';
import 'package:transparent_image/transparent_image.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:nstw/services/socket-services.dart';
import 'package:nstw/pages/LoginLayout.dart';
import 'package:nstw/pages/MapLayout.dart';
import 'package:nstw/pages/ProfileLayout.dart';
import 'package:get_it/get_it.dart';

StreamSubscription<LocationDto>? locationSubscription;

void stop() {
    locationSubscription?.cancel();
    LocationManager().stop();
}

class DrawerScreen{
     
     final AlertSocket locator = GetIt.instance<AlertSocket>();
     final LocalStorage storage = new LocalStorage('nstw_app'); 

     Widget init(BuildContext context, Map<String, dynamic> profile){

        return  Theme(
           data: Theme.of(context).copyWith(
                 canvasColor: Colors.blueGrey[200], 
            ),
            child: Drawer(
              child: ListView(
                padding: EdgeInsets.zero,
                children: <Widget>[
                    DrawerHeader(                        
                        child: Column(
                            crossAxisAlignment : CrossAxisAlignment.start,
                            mainAxisAlignment : MainAxisAlignment.spaceBetween,
                            children : [
                                 Container(
                                    child : ClipRRect(
                                        borderRadius: BorderRadius.circular(40.0),
                                        child : (profile.isNotEmpty) ? Container(
                                            decoration: BoxDecoration(
                                            borderRadius: BorderRadius.circular(30.0),
                                            boxShadow: [
                                                    BoxShadow(
                                                        color: Colors.white, 
                                                        spreadRadius: 3,
                                                        blurRadius: 5,
                                                        offset: Offset(0, 5)
                                                    ),
                                                ],
                                            ),
                                            child: FadeInImage.memoryNetwork(
                                                placeholder: kTransparentImage,
                                                image: profile['photo'],
                                                width: 70.0, height:70.0
                                            )
                                        ): Text("Loading..")
                                        
                                    )
                                ),
                                Container(                                    
                                    child: (profile.isNotEmpty) ? Text(profile['fullname'], style: TextStyle(fontSize: 20.0)) : Text("Loading...")
                                ),
                                Container(                                    
                                    child: (profile.isNotEmpty) ? Text(profile['email']) : Text("Loading...")
                                )
                            ]
                        ),
                        decoration: BoxDecoration(
                          color: Colors.blue,
                        )
                    ),
                    Container(  
                        margin: EdgeInsets.only(bottom:5.0),                      
                        child: ListTile(                        
                        leading : const Icon(Icons.map, color: Colors.white),
                        title: Text('Map'),
                        onTap: () async {      
                                String uid = storage.getItem('uid');                                                                                                
                                Navigator.push(context, MaterialPageRoute(builder: (context) => MapLayout(driverName: uid)));
                            },
                        ),
                        decoration: BoxDecoration(
                            color: Colors.blue[300],
                            boxShadow: [
                                BoxShadow(
                                    color: Colors.grey.withOpacity(1.0), 
                                    spreadRadius: 1,
                                    blurRadius: 1,
                                    offset: Offset(-1, 2)
                                ),
                            ]
                        )
                    ),
                    Container(  
                        margin: EdgeInsets.only(bottom:5.0),                      
                        child: ListTile(                        
                        leading : const Icon(Icons.account_box, color: Colors.white),
                        title: Text('Profile'),
                        onTap: () async {      
                                String uid = storage.getItem('uid');                                                                                                
                                Navigator.push(context, MaterialPageRoute(builder: (context) => ProfileLayout(driverName: uid)));
                            },
                        ),
                        decoration: BoxDecoration(
                            color: Colors.blue[300],
                            boxShadow: [
                                BoxShadow(
                                    color: Colors.grey.withOpacity(1.0), 
                                    spreadRadius: 1,
                                    blurRadius: 1,
                                    offset: Offset(-1, 2)
                                ),
                            ]
                        )
                    ),
                    Container(                        
                        child: ListTile(                        
                            leading : const Icon(Icons.logout, color: Colors.white),
                            title: Text('Logout'),
                            onTap: () async {    
                                    User? user = FirebaseAuth.instance.currentUser;
                                    final uid = user?.uid ?? "";
                                    locator.signal_logout(uid);                        
                                    locator.signal_offline_icon(uid);
                                    await FirebaseAuth.instance.signOut(); 
                                    stop();                                                               
                                    Navigator.pushAndRemoveUntil(context, MaterialPageRoute(builder: (context) => LoginLayout()), (route) => false);
                                },
                            ),
                            decoration: BoxDecoration(
                                color: Colors.blue[300],
                                boxShadow: [
                                    BoxShadow(
                                        color: Colors.grey.withOpacity(1.0), 
                                        spreadRadius: 1,
                                        blurRadius: 1,
                                        offset: Offset(-1, 2)
                                    ),
                                ]
                            )
                        )
                    ]
                )
            )
        );

    }

}