import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter/foundation.dart'
    show debugDefaultTargetPlatformOverride;
import 'package:flutter/services.dart';
import 'package:geolocator/geolocator.dart';
import 'package:flutter_background_service/flutter_background_service.dart';
import 'package:flutter_background_service_android/flutter_background_service_android.dart';
import 'package:carp_background_location/carp_background_location.dart';
import 'package:permission_handler/permission_handler.dart';

import 'dart:async';
import 'dart:convert';
import 'dart:typed_data';
import 'package:intl/intl.dart';
import 'package:latlong2/latlong.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:nstw/components/ModalComponent.dart';
import 'package:nstw/components/DrawerScreen.dart';
import 'package:nstw/components/SharedComponent.dart';
import 'package:nstw/services/socket-services.dart';
import 'package:nstw/services/firebase-services.dart';
import 'package:get_it/get_it.dart';

class MapLayout extends StatefulWidget{

    String driverName;
    MapLayout({Key? key, this.driverName = ""}) : super(key: key);

    @override
    _MapLayout createState() {
       return new _MapLayout();
    }

}

enum LocationStatus { UNKNOWN, INITIALIZED, RUNNING, STOPPED }

class _MapLayout extends State<MapLayout> {

    final DrawerScreen drawer = new DrawerScreen();
    final SharedComponent sharecom = new SharedComponent();
    final GlobalKey<ScaffoldState> navigatorKey = new GlobalKey();
    final AlertSocket locator = GetIt.instance<AlertSocket>();
    final FireBaseServ fireserv = new FireBaseServ();
    final mapController = MapController();
    String mapTemplate = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
    final ModalComponent modal = new ModalComponent();
    LatLng _latlng = LatLng(10.97736625338629, 122.71513490354138);

    Map<String, dynamic> profile = {};
    String destination = "icc";
    Map<String, String> exhibits = { 
        "icc": "Main S&T Exhibits", 
        "hinablon": "Fibers and Textiles \nS&T Exhibits", 
        "maritime": "Maritime \nS&T Exhibits"
    };

    String logStr = '';
    LocationDto? _lastLocation;
    StreamSubscription<LocationDto>? locationSubscription;
    LocationStatus _status = LocationStatus.UNKNOWN;

    @override
    initState() {
        super.initState(); 
        // WidgetsBinding.instance.addObserver(this); 
         if(mounted){

            if(locator.is_disconnected()){
                locator.socket_reconnect();
            } 

            LocationManager().interval = 10;
            LocationManager().distanceFilter = 0;
            LocationManager().notificationTitle = 'CARP Location Example';
            LocationManager().notificationMsg = 'CARP is tracking your location';

            LocationManager().getCurrentLocation().then((LocationDto location){
                
                var last_latlng = {
                    'lat': location.latitude,
                    'lng': location.longitude
                };

                locator.check_active(widget.driverName, last_latlng);
                locator.signal_active(widget.driverName, last_latlng);
                locator.socket_send_route(widget.driverName, last_latlng);
            });

            locator.check_avatar(widget.driverName);
        }  

    }    

    void onData(LocationDto location) {

        var last_latlng = {
            'lat': location.latitude,
            'lng': location.longitude
        };                                
        
        var latlng = LatLng(location.latitude, location.longitude);

        mapController.move(latlng, 15);

        print(latlng);

        setState((){
            _latlng = latlng;
        });

        locator.socket_send_route(widget.driverName, last_latlng);

        setState((){
            _status = LocationStatus.RUNNING;
        });
      }

      /// Is "location always" permission granted?
      Future<bool> isLocationAlwaysGranted() async =>
          await Permission.locationAlways.isGranted;

      /// Tries to ask for "location always" permissions from the user.
      /// Returns `true` if successful, `false` otherwise.
      Future<bool> askForLocationAlwaysPermission() async {
        bool granted = await Permission.locationAlways.isGranted;

        if (!granted) {
          granted =
              await Permission.locationAlways.request() == PermissionStatus.granted;
        }

        return granted;
      }
      
    void start() async {
        
        if (!await isLocationAlwaysGranted())
          await askForLocationAlwaysPermission();

        locationSubscription?.cancel();
        locationSubscription = LocationManager().locationStream.listen(onData);
        await LocationManager().start();
        setState((){
            _status = LocationStatus.RUNNING;
        });

    }

    void stop() {
        locationSubscription?.cancel();
        LocationManager().stop();
        setState(() {
          _status = LocationStatus.STOPPED;
        });
    }

    @override
    void dispose() {       
      // WidgetsBinding.instance.removeObserver(this);
      locator.socket_disconnect();        
      super.dispose();
      
    }

    // @override
    // void didChangeAppLifecycleState(AppLifecycleState state) {
        
    //     if(state == AppLifecycleState.inactive){            
    //         locator.signal_logout(widget.driverName);       
    //     }
    //     else if(state == AppLifecycleState.resumed){            
    //         Geolocator.getCurrentPosition().then((Position pos){
    //             var last_latlng = {
    //                 'lat': pos.latitude,
    //                 'lng': pos.longitude
    //             };
    //             locator.check_active(widget.driverName, last_latlng);
    //             locator.signal_active(widget.driverName, last_latlng);
    //         }); 
    //     }

    // }

    // Future<bool> onEnableLocation() async {
        
    //       bool serviceEnabled;
    //       LocationPermission permission;

    //       serviceEnabled = await Geolocator.isLocationServiceEnabled();

    //       if (!serviceEnabled) {        
    //             return false;
    //       }

    //       permission = await Geolocator.checkPermission();          
    //       if (permission == LocationPermission.denied) {
    //         permission = await Geolocator.requestPermission();
    //         if (permission == LocationPermission.denied) {
    //             return false;
    //         }
    //       }
          
    //       if (permission == LocationPermission.deniedForever) {        
             
    //          return false;

    //       }

    //       Position pos = await Geolocator.getCurrentPosition();                   

    //       var latlng = LatLng(pos.latitude, pos.longitude);

    //       locator.socket_send_route(widget.driverName, {
    //             'lat': latlng.latitude,
    //             'lng': latlng.longitude
    //       });

    //       mapController.move(latlng, 15);

    //       setState((){
    //          _latlng = latlng;
    //       });

    //       return true;

    // }

    onExhibits(String val){
        
        setState((){
            destination = val;
        });

        fireserv.update_destination(val, widget.driverName).then((item){
            modal.dest_updated(context, exhibits[destination]!);
        });

    }


    Widget build(BuildContext context) {

        Widget initMarker(){

            if(destination == "icc"){
                return Image(image: AssetImage('assets/images/markers1.png'));
            }
            else if(destination == "maritime"){
                return Image(image: AssetImage('assets/images/markers2.png'));
            }
            else if(destination == "hinablon"){
                return Image(image: AssetImage('assets/images/markers3.png'));
            }

            return Image(image: AssetImage('assets/images/marker.png'));
        }

        return Scaffold(
            key : navigatorKey,
            drawer : drawer.init(context, profile),
            body: SafeArea(
                child: Column(
                    children: [
                        sharecom.appBar2(navigatorKey),
                        Container(
                            decoration: BoxDecoration(
                                color: Color.fromRGBO(19, 44, 80, 1)
                            ),
                            padding: EdgeInsets.symmetric(vertical: 10.0, horizontal: 10.0),
                            child: Row(
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                    Text("Destination: " + exhibits[destination]!, style: TextStyle(color: Colors.white)),
                                    Container(
                                        decoration: const ShapeDecoration(
                                            color: Colors.lightBlue,
                                            shape: CircleBorder(),
                                        ),
                                        child: IconButton(
                                          iconSize: 20.0,
                                          color: Colors.white,
                                          icon: const Icon(Icons.location_city),
                                          tooltip: 'Back',
                                          onPressed: () {
                                                modal.display_exhibits(context, onExhibits);
                                          },
                                        )
                                    )
                                ]
                            )
                        ),
                        Expanded(
                            child: Stack(
                                children: [
                                    FlutterMap(
                                        mapController: mapController,
                                        options: MapOptions(
                                          onMapReady: (){
                                                // onEnableLocation().then((bool res){
                                                //     if(!res){
                                                //         modal.display_disclosure(context, onEnableLocation);
                                                //     }                                            
                                                // });
                                          },
                                          center: LatLng(10.97736625338629, 122.71513490354138),
                                          interactiveFlags: InteractiveFlag.pinchZoom | InteractiveFlag.drag,
                                          zoom: 15,
                                          maxZoom: 18,
                                          onTap: (tapPos, latLng) {                                
                                               
                                          }                          
                                        ),
                                        children: [
                                            TileLayer( urlTemplate: mapTemplate, userAgentPackageName: 'dev.fleaflet.flutter_map.example'),                                    
                                            MarkerLayer(
                                                markers: [

                                                    Marker(
                                                            width: 30.0,
                                                            height: 30.0,
                                                            point: _latlng,
                                                            builder: (ctx) =>  InkWell(                                              
                                                                child: initMarker(),
                                                                onTap: (){
                                                                   
                                                                }
                                                            ),
                                                            key: ValueKey("1")
                                                        )
                                                ]
                                              ),
                                        ],
                                    ),                                   
                                    Positioned(
                                        bottom: 5,
                                        right: 10,
                                        child: Container(                                            
                                            child: (_status != LocationStatus.RUNNING) ? ElevatedButton(                                                    
                                                child: Padding(
                                                        padding: EdgeInsets.symmetric(horizontal: 20.0),
                                                        child: Text("Start Tracking", style : TextStyle(fontSize: 17.0, color : Colors.white, fontWeight : FontWeight.w300)
                                                    )
                                                ),           
                                                onPressed: () {                                                         
                                                    // FlutterBackgroundService().invoke("setAsBackground", {});
                                                    // modal.notif_backgroundserv(context);
                                                    start();
                                                }
                                            ): ElevatedButton(
                                            style: ElevatedButton.styleFrom(
                                                    primary: Colors.red,
                                                ),                                                   
                                                child: Padding(
                                                        padding: EdgeInsets.symmetric(horizontal: 20.0),
                                                        child: Text("Stop Tracking", style : TextStyle(fontSize: 17.0, color : Colors.white, fontWeight : FontWeight.w300)
                                                    )
                                                ),           
                                                onPressed: () {                                                         
                                                    // FlutterBackgroundService().invoke("setAsBackground", {});
                                                    // modal.notif_backgroundserv(context);
                                                    stop();
                                                }
                                            )
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


