import React, { Suspense, createRef } from "react";
import { Link, Navigate } from "react-router-dom";
import { TrackMap } from '../components/mapping'
import { UserAvatars } from '../components/mapcom'
import CloseIcon from '../assets/popup-close-icon.png'

class MainMap extends React.Component{
	
	constructor(props){
		super(props)		
	}

	componentDidMount(){
		
	}

	render(){

		return(
			<div className="position-relative">
				<TrackMap />
				<div style={{ position: 'absolute', top:'20px', right: '20px'}}>
					<button style={{ backgroundColor: 'unset', border: 'unset' }} onClick={(e) => {
						localStorage.clear()
						window.location.href = "/"
					}}>
						<img src={CloseIcon} width="50px" height="50px" />
					</button>
				</div>
			</div>
		)

	}

}

export default MainMap