import React, { Suspense, useState, useEffect  } from "react";
import { useSelector, useDispatch } from 'react-redux'
import { onlineAvatars, streamOffline, onlineAvatars2 } from '../services/socket-services';
import { do_online_avatars, do_select_driver, do_display_drivers } from '../redux/actions'

export const UserAvatars = (props) => {
	
	const driverState = useSelector((state) => state.driver_redux )	
	const dispatch = useDispatch()
	const [isHide, setHide] = useState(false)
	const [drivers, setDrivers ] = useState([])	

	onlineAvatars((res) => {	

		var json = JSON.parse(res)
		var user = json.driver
		var map = driverState.avatars.map((item) => {
			if(item.id == user){
				Object.assign(item, { ...item, is_online: true})
			}

			return item
		})

		dispatch(do_online_avatars(map))
		
	})

	streamOffline((res) => {

		var json = JSON.parse(res)
		var user = json.driver		
		var map = driverState.avatars.map((item) => {
			if(item.id == user){
				Object.assign(item, { ...item, is_online: false})
			}

			return item
		})

		dispatch(do_online_avatars(map))

	})

	onlineAvatars2((res) => {
		var json = JSON.parse(res)
		var user = json.driver
		var map = driverState.avatars.map((item) => {
			if(item.id == user){
				Object.assign(item, { ...item, is_online: true})
			}

			return item
		})

		dispatch(do_online_avatars(map))
	})

	const onSelectMarker = (item, index) => {
		dispatch(do_select_driver(item.id, index))		
	}
	
	if(isHide){
		return (
			<div className="show-btn">
				<button className='btn btn-md btn-primary' onClick={(e) => setHide(!isHide)}>Show Avatars</button>
			</div>
		)
	}

	return (
		<div id="avatars">
			<div className='wrapper'>
				<div className='content'>
					{
						(driverState.avatars.length) ? driverState.avatars.map((item, index) => {

							if(item.is_online){
								return  (
									<button className='avatar-btn active' onClick={(e) => onSelectMarker(item, index)} key={'avatar-'+index}>
										<div className='avatar' key={'avatar-'+index}>
											<div className='img'>
												<img src={item.photo} width="30" />
											</div>										
										</div>
										{(item.isSelected) ? <span className="selected-avatar">&#187;</span> : <span></span>}
									</button>
								)
							}

							return (
								<button className='avatar-btn' onClick={(e) => onSelectMarker(item, index)} key={'avatar-'+index}>
									<div className='avatar' key={'avatar-'+index}>
										<div className='img'>
											<img src={item.photo} width="30" />
										</div>																
									</div>

									{(item.isSelected) ? <span className="selected-avatar">&#187;</span> : <span></span>}
								</button>
							)

						}): <span></span>
					}
				</div>
			</div>
			<button className='btn btn-sm btn-primary' style={{position: 'absolute', left: '22px', bottom: '70px'}} onClick={(e) => setHide(!isHide)}>Hide</button>
			<button className='btn btn-sm btn-primary' style={{position: 'absolute', left: '22px', bottom: '30px'}} onClick={(e) => {
				localStorage.clear()
				window.location.href = "/"
			}}>Logout</button>
		</div>

	)


}


export const UserAvatars2 = (props) => {
	
	const { drivers, onSelectDriver } = props

	const onSelectMarker = (item, index) => {
		
	}
	

	return (
		<div id="avatars">
			<div className='wrapper'>
				<div className='content'>
					{
						(drivers.length) ? drivers.map((item, index) => {

							if(item.is_online){
								return  (
									<button className='avatar-btn' onClick={(e) => onSelectMarker(item, index)} key={'avatar-'+index}>
										<div className='avatar active' key={'avatar-'+index}>
											<div className='img'>
												<img src={item.photo} width="30" />
											</div>										
										</div>
									</button>
								)
							}

							return (
								<button className='avatar-btn' onClick={(e) => onSelectDriver(item)} key={'avatar-'+index}>
									<div className='avatar' key={'avatar-'+index}>
										<div className='img'>
											<img src={item.photo} width="30" />
										</div>																
									</div>
								</button>
							)

						}): <span></span>
					}
				</div>
			</div>			
		</div>

	)


}