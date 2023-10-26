import update from 'react-addons-update';
import { DRIVERS, AVATARS, SELDRIVER, LASTLOC, DESTINATION, REFRESH, UPDATEDRIVER } from './constant.js'

const driver_state = {
	drivers: [],
	avatars: []
}

export function DriverReducer(state = driver_state, action) {

	switch (action.type) {

		case DRIVERS : {
			return {
				...state,
				drivers: action.drivers				
			}
		}
		break;
		case AVATARS : {
			return {
				...state,
				avatars: action.avatars				
			}
		}
		break;
		case LASTLOC : {

			var array1 = update(state.drivers,
			{
				[action.index]: {
					$set: {
						...state.drivers[action.index],
						pos: action.pos
					}
					
				}
			});	

			return {
				...state,
				drivers: array1			
			}
		}
		break;
		case UPDATEDRIVER : {

			var array1 = update(state.drivers,
			{
				[action.index]: {
					$set: {
						...state.drivers[action.index],
						pos: action.latlng,
						isOnline: true
					}
					
				}
			});	
			
			return {
				...state,
				drivers: array1			
			}
		}
		break;
		case SELDRIVER: {		
			
			var array0 = state.drivers.map((item) => {
				return {
					...item,
					isSelected: false
				}
			})

			var avatar0 = state.avatars.map((item) => {
				return {
					...item,
					isSelected: false
				}
			})

			var array1 = update(array0,
			{
				[action.index]: {
					$set: {
						...state.drivers[action.index],
						isSelected: !state.drivers[action.index].isSelected
					}
					
				}
			});

			var avatar1 = update(avatar0,
			{
				[action.index]: {
					$set: {
						...state.avatars[action.index],
						isSelected: !state.avatars[action.index].isSelected
					}
					
				}
			});						

			return {
				...state,
				drivers: array1,
				avatars: avatar1
			}
		}
		case DESTINATION: {

			var drivers = state.drivers.map((item) => {
				if(action.uids.indexOf(item.id) != -1){
					var index = action.uids.indexOf(item.id)
					return {
						...item,
						dest: action.locs[index],
						exhibit: action.exhibits[index],
					}
				}

				return item
			}) 

			return {
				...state,
				drivers: drivers
			}

		}
		case REFRESH: {

			var avatars = state.avatars.map((item) => {
				return {
					...item,
					is_online: false
				}
			})

			return {
				...state,
				avatars: avatars
			}
		}
		default:
		return state

	}

}