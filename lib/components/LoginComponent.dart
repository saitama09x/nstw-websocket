import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';
import 'dart:async';
import 'dart:convert';

class LoginComponent{

	Widget userNameInput(Function onUsername){

		return Container(
                child : Row(
                    children: [
                        Flexible(
                            child : Container(
                                padding : EdgeInsets.symmetric( horizontal : 20.0),
                                margin : EdgeInsets.only(bottom : 10.0),
                                child : TextField(                                      
                                      textInputAction: TextInputAction.done,
                                      decoration: InputDecoration(
                                        filled: true,
                                        fillColor: Color(0x62FFFFFF),
                                        hintText: 'Username',
                                        labelText: 'Username',
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
                                         onUsername(text);
                                       }
                                    )
                              )
                        ),
                    ]
                )
            );

		}


	Widget passInput(Function onPassword, Function onShowPass, bool _isObscure){

		return Container(
            margin : EdgeInsets.only(bottom: 20.0),
            child : Row(
                children : [
                    Flexible(
                        child : Container(
                            padding : EdgeInsets.symmetric( horizontal : 20.0),
                            child : TextField(
                                  obscureText: _isObscure,
                                  textInputAction: TextInputAction.done,
                                  decoration: InputDecoration(
                                    filled: true,
                                    fillColor: Color(0x62FFFFFF),
                                    hintText: 'Password',
                                    labelText: 'Password',
                                    suffixIcon: IconButton(
                                    icon: Icon(
                                            _isObscure ? Icons.visibility : Icons.visibility_off
                                        ),
                                        onPressed: () {
                                          onShowPass();
                                        }
                                    ),
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
                                  onChanged: (text) {
                                     onPassword(text);
                                   },
                                   style: TextStyle(
                                      fontSize: 17.0,
                                      color: Colors.black                  
                                    )
                                )
                          )
                    )
                ]
            )
        );

	}

}