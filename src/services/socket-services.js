import React, { Suspense } from "react";
import { Manager } from "socket.io-client";



const manager = new Manager("ws://127.0.0.1:3001", {
  reconnectionDelayMax: 10000  
});

var socket = manager.socket("/drivers");

export const getSocket = () => {
		return socket
}

export const doConnect = () => {
	socket.on('connect', () => {
			socket.emit('mobile', {
					type: 'check_active',
					data: {
							'status': 1 
					}
			})  
	})
}

export const doConnectDriver = () => {
		socket.emit('mobile', {
				type: 'check_active',
				data: {
						'status': 1 
				}
		}) 
}

export const checkAvatarOnline = () => {
	socket.emit('mobile', {
			type: 'check_avatar',
			data: {
					'status': 1
			}
	})
}

export const streamTracking = (callback) => {
	socket.on('driver_location', (res) => {		
		if(res){
			callback(res)				
		}
	})
}

export const streamAdminTracking = (callback) => {
	socket.on('admin_driver_location', (res) => {		
		if(res){
			callback(res)				
		}
	})
}


export const streamOnline = (callback) => {
	socket.on('active_driver', (res) => {		
		if(res){
			callback(res)				
		}
	})
}

export const streamAdminOnline = (callback) => {
	socket.on('admin_active_driver', (res) => {		
		if(res){
			callback(res)				
		}
	})
}

export const streamOffline = (callback) => {

	socket.on('signout_driver', (res) => {		
		if(res){
			callback(res)				
		}
	})
	
}

export const streamOfflineIcon = (callback) => {

	socket.on('offline_icon', (res) => {		
		if(res){
			callback(res)				
		}
	})
	
}

export const streamAdminOfflineIcon = (callback) => {

	socket.on('admin_offline_icon', (res) => {		
		if(res){
			callback(res)				
		}
	})
	
}


export const onlineAvatars = (callback) => {
	socket.on('check_avatar', (res) => {		
		if(res){
			callback(res)				
		}
	})
}

export const onlineAvatars2 = (callback) => {
	socket.on('online_avatar', (res) => {		
		if(res){
			callback(res)				
		}
	})
}

export const onlineDrivers = (callback) => {
	socket.on('online_drivers', (res) => {		
		if(res){
			callback(res)				
		}
	})
}