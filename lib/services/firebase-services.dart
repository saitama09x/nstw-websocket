import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:nstw/pages/MapLayout.dart';
import 'dart:io';
import 'dart:convert';

FirebaseFirestore firestore = FirebaseFirestore.instance;

class FireBaseServ{     

	void addUser(BuildContext context, String displayName, String email, String uid, String photo){
		
		DocumentReference users = firestore.collection('drivers').doc("profile_" + uid);

		users.set({
            'fullname': displayName,
            'photo': photo,
            'email': email,
            'uid': uid,
            'status': 1
          }).then((value){
          	
          	Navigator.push(context, MaterialPageRoute(builder: (context) => MapLayout(driverName: uid)));

          }).catchError((error) => print("Failed to add user: $error"));

	}


	Future<bool> check_profile_exists(String uid) async{

		final docRef = firestore.collection("drivers").doc("profile_" + uid);

		DocumentSnapshot snap = await docRef.get();

		if(!snap.exists){
			return false;
		}
	
		return true;		

	}

	Future<Map<String, dynamic>> single_profile(String uid) async{

		final docRef = firestore.collection("drivers").doc("profile_" + uid);

		DocumentSnapshot snap = await docRef.get();

		if(!snap.exists){
			return {};
		}
	
		return snap.data()! as Map<String, dynamic>;

	}

	Future<void> last_latlng(Map<String, dynamic> form, String uid) async{

		int timestamp = DateTime.now().millisecondsSinceEpoch;
		String time_str = timestamp.toString();

		DocumentReference users = firestore.collection("latlng_" + uid).doc(time_str);

		users.set({
            "location": jsonEncode(form),
          }).then((value){                  

          }).catchError((error) => print("Failed to add user: $error"));

	}

	Future<bool> update_profile(Map<String, dynamic> form, String uid) async{

		final docRef = firestore.collection("drivers").doc("profile_" + uid);

		await docRef.update({
			'email': form['email'],
			'fullname': form['fullname']
		});

		return true;

	}

	Future<void> update_destination(String exhibit, String uid) async{

		DocumentReference docRef = firestore.collection("destination").doc("dest_" + uid);
		docRef.set({
            'exhibit': exhibit,  
            'uid': uid          
          }).then((value){

          });

	}
}
