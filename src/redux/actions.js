import { DRIVERS, AVATARS, SELDRIVER, LASTLOC, DESTINATION, REFRESH, ISONLINE, UPDATEDRIVER } from './constant.js'


export function do_display_drivers( vals ) {
	
	return {
		type : DRIVERS,
		drivers : vals		
	}
	
}


export function do_online_avatars( vals ) {	
	return {
		type : AVATARS,
		avatars : vals		
	}
	
}

export function do_select_driver( uid, index ){

	return {
		type: SELDRIVER,
		uid: uid,
		index: index
	}

}

export function do_update_driver( index, latlng, isOnline ){

	return {
		type: UPDATEDRIVER,		
		index: index,
		latlng: latlng,
		isOnline: isOnline
	}

}

export function do_update_lastloc( uid, index, pos ){

	return {
		type: LASTLOC,
		uid: uid,
		index: index,
		pos: pos
	}

}

export function do_refresh(){
	return {
		type: REFRESH
	}
}


export function do_destination(dest){

	var uids = []
	var locs = []
	var exhibits = []
	if(dest.length){

		uids = dest.map((item) => {
			return item.uid
		})

		locs = dest.map((item) => {
			return item.dest
		})

		exhibits = dest.map((item) => {
			return item.exhibit
		})

	}

	return {
		type: DESTINATION,
		locs: locs,
		uids: uids,
		exhibits: exhibits
	}

}