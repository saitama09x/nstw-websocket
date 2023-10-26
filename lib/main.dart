import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:firebase_core/firebase_core.dart';
import 'firebase_options.dart';
import 'package:device_info_plus/device_info_plus.dart';
import 'package:flutter_background_service/flutter_background_service.dart';
import 'package:flutter_background_service_android/flutter_background_service_android.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:nstw/pages/LoginLayout.dart';
import 'package:nstw/services/socket-services.dart';

import 'package:geolocator/geolocator.dart';
import 'package:latlong2/latlong.dart';

import 'package:get_it/get_it.dart';
import 'dart:async';
import 'dart:io';
import 'dart:ui';

GetIt locator = GetIt.instance;

Future<void> onEnableLocation() async {
            
    LocationPermission permission;

    permission = await Geolocator.checkPermission();          
    
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
     
    }

}

void main() async {
  
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );
  
   
  // await initializeService();
  await onEnableLocation();

  locator.registerLazySingleton(() => AlertSocket());

  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  
  const MyApp({super.key});
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(      
        primarySwatch: Colors.blue
      ),
      home: LoginLayout(),
      builder : (context, widget){
          return new Scaffold(            
            resizeToAvoidBottomInset: false,
            body: AnnotatedRegion<SystemUiOverlayStyle>( 
                   value: SystemUiOverlayStyle(
                      statusBarColor: Colors.blue,
                  ), 
                  child: Container(
                    child: widget
                  )
              )
          );
      }
    );
  }
}
