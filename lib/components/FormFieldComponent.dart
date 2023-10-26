import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart'
    show debugDefaultTargetPlatformOverride;
import 'package:flutter/services.dart';
import 'dart:async';
import 'dart:convert';


class FormFieldComponent{

    Widget InputEditField(BuildContext context, String label, TextEditingController control, Function changeText){

        return  Container(
            margin: EdgeInsets.only(top: 10.0),
            child : Row(
                children: [
                    Flexible(
                        child : Container(
                            padding : EdgeInsets.symmetric( horizontal : 5.0),
                            margin : EdgeInsets.only(bottom : 10.0),
                            child : TextField(
                                  controller: control,
                                  textInputAction: TextInputAction.done,
                                  decoration: InputDecoration(
                                    filled: true,
                                    fillColor: Color(0x62FFFFFF),                                    
                                    labelText: label,
                                    border: new OutlineInputBorder(
                                        borderRadius: BorderRadius.all(Radius.circular(10)),
                                        borderSide: BorderSide(width: 1, color: Color(0xFFFFFFFF))
                                    ),
                                    focusedBorder: OutlineInputBorder(
                                        borderRadius: BorderRadius.all(Radius.circular(10)),
                                        borderSide: BorderSide(width: 1, color: Colors.lightBlue),
                                    ),
                                    labelStyle: TextStyle(
                                      color: Color(0x61000000)
                                    ),
                                    contentPadding: const EdgeInsets.symmetric(horizontal: 10.0),
                                  ),
                                  style: TextStyle(
                                      fontSize: 17.0,
                                      color: Colors.black                  
                                   ),
                                  onChanged: (text) {
                                    changeText(text);
                                  }
                                )
                          )
                    ),
                ]
            )
        );

    }

}