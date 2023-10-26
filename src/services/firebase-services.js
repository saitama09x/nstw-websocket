import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, onSnapshot, doc, query, where, getDoc, updateDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import * as moment from 'moment';

const firebaseConfig = {
  apiKey: "AIzaSyDsW2K-BtGxmDXKiItNKXA4pDwq5efkWNU",
  authDomain: "geotagging-b9974.firebaseapp.com",
  projectId: "geotagging-b9974",
  storageBucket: "geotagging-b9974.appspot.com",
  messagingSenderId: "292253035892",
  appId: "1:292253035892:web:56cd5d82b8fc29e0769021",
  measurementId: "G-HYV9NMG56D"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const fixed_pos = [
	{
	    lng: 122.56041325192585,
	    lat: 10.70653923351611
	},
	{
	    lng: 122.5426669313959,
	    lat: 10.712028003440253
	},
	{
	    lng: 122.5337937711309,
	    lat: 10.690072324359946
	},
	{
	    lng: 122.46885717159226,
	    lat: 10.700041739766462
	}
	
]

const exhibits = {
	'icc': {
    lng: 122.54481357008245,
    lat: 10.714329397484462
	},
	'hinablon': {
    lng: 122.56878066149552,
    lat: 10.704141637067679
	},
	'maritime': {
    lng: 122.5733817976063,
    lat: 10.693076390885821
	}
}

export const get_drivers = async () => {	

	const querySnapshot = await getDocs(collection(db, "drivers"));
	var result_arr = [];
	var index = 0
	querySnapshot.forEach((doc) => {		
		
		var data = doc.data()
	  	result_arr.push({
			id: data.uid,
			name: data.fullname,
			email: data.email,
			photo: data.photo,
			status: data.status,
			isSelected: false,
			isOnline: true,
			pos: { lat: 0.0, lng: 0.0 },
			dest: { lat: 0.0, lng: 0.0 },
			exhibit: ''
		})
	  index++

	});

	return result_arr
}

export const get_active_drivers = async () => {	

	const cols = collection(db, "drivers")
	const querySnapshot = query(cols, where('status', '==', 1))
	const docs = await getDocs(querySnapshot);
	var result_arr = [];

	docs.forEach((doc) => {		
		
		var data = doc.data()
	  	result_arr.push({
			id: data.uid,
			name: data.fullname,
			email: data.email,
			photo: data.photo,
			status: data.status,
			isSelected: false,
			isOnline: false,
			pos: { lat: 0.0, lng: 0.0 },
			dest: { lat: 0.0, lng: 0.0 },
			exhibit: ''
		})

	});

	return result_arr
}

export const live_update_driver = async (callback) => {

	const cols = collection(db, "drivers")
	const querySnapshot = query(cols, where('status', '==', 1))	

	const unsub = onSnapshot(querySnapshot, (docs) => {
			
			var result_arr = [];
			docs.forEach((doc) => {			
				var data = doc.data()					
			  	result_arr.push({
					id: data.uid,
					name: data.fullname,
					email: data.email,
					photo: data.photo,
					status: data.status,
					isSelected: false,
					isOnline: false,
					pos: { lat: 0.0, lng: 0.0 },
					dest: { lat: 0.0, lng: 0.0 },
					exhibit: ''
				})
			});

	    callback(result_arr);

	});

}

export const live_update_destination = async (callback) => {

		const cols = collection(db, "destination")

		const unsub = onSnapshot(cols, (docs) => {
				var result_arr = []
				docs.forEach((doc) => {	
						var data = doc.data()
						result_arr.push({
							uid: data.uid,
							dest: exhibits[data.exhibit],
							exhibit: data.exhibit
						})
				})

				callback(result_arr)
		})
}


export const last_location = async (uid) => {

	const querySnapshot = await getDocs(collection(db, "latlng_" + uid));
	var result_arr = [];
	querySnapshot.forEach((doc) => {
				var data = doc.data()
				var loc = JSON.parse(data.location)				
				result_arr.push(loc)
	})

	return result_arr
}

export const driver_history = async(uid) => {

	const querySnapshot = await getDocs(collection(db, "latlng_" + uid));
	var result_arr = [];
	querySnapshot.forEach((doc) => {
				var data = doc.data()		
				var json = JSON.parse(data.location)
				var day = moment(doc.id).format("x");
				var date = new Date(doc.id * 1000).toLocaleTimeString()			
				result_arr.push({
						date: date,
						lat: json.lat,
						lng: json.lng
				})
	})

	return result_arr

}

export const get_single_driver = async (uid) => {

	const querySnapshot = await getDoc(doc(db, "drivers", "profile_" + uid));

	if (!querySnapshot.exists()) {
			return false
	}

	return querySnapshot.data()
}

export const update_status_driver = async(uid, status) => {

	const ref = doc(db, "drivers", "profile_" + uid);

	await updateDoc(ref, {		  
		  status: status	  
	});

}

export const update_photo_driver = async(uid, photo) => {

	const ref = doc(db, "drivers", "profile_" + uid);

	await updateDoc(ref, {		  
		  photo: photo	  
	});

}

export const update_single_driver = async(uid, form) => {

	const ref = doc(db, "drivers", "profile_" + uid);

	await updateDoc(ref, {
			email: form.email,
			fullname: form.fullname,
		  photo: form.photo,
		  status: form.status	  
	});

}

export const admin_login = async (username, password) => {

	const q = query(collection(db, "admin"), where("username", "==", username), where("password", "==", password));

	const querySnapshot = await getDocs(q);

	return querySnapshot.size	

}

export const client_login = async (username, password) => {

	const q = query(collection(db, "client"), where("username", "==", username), where("password", "==", password));

	const querySnapshot = await getDocs(q);

	return querySnapshot.size	

}

export const upload_picture = async(file) => {

	const storage = getStorage();
	const storageRef = ref(storage, file.name);
	const snapshot = await uploadBytes(storageRef, file);
	const dl = getDownloadURL(ref(storage, file.name))
	return dl
}



