import React, { Suspense, createRef } from "react";
import { Link, Navigate } from "react-router-dom";
import { TrackMap2, DrawMap, DrawMap2} from '../../components/mapping'
import { UserAvatars2, UserAvatars } from '../../components/mapcom'
import { get_drivers, last_location, driver_history } from '../../services/firebase-services'
import { do_online_avatars  } from '../../redux/actions'

class AdminMap extends React.Component{
	
	constructor(props){
		super(props)
		this.state = {
			drivers: [],
			markers: []
		}		
	}

	componentDidMount(){
		get_drivers().then((res) => {
			if(res.length > 0){
				var result_arr = []
				res.forEach((item) => {
					result_arr.push({
						id: item.id,
						photo: item.photo,
						is_online: false
					})
				})
				
				this.setState({
					drivers: result_arr
				})
			}
		})
	}

	onSelectDriver(driver){
		driver_history(driver.id).then((res) => {
			if(res.length > 0){
				this.setState({
					markers: res
				})
			}
		})
	}

	render(){
		const { drivers, markers } = this.state

		return(
			<div className="position-relative">
				<UserAvatars />
				<TrackMap2 />
			</div>
		)

	}

}

export default AdminMap