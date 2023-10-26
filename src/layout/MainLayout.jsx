import React, { Suspense, createRef } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { connect, ConnectedProps, useDispatch } from 'react-redux'
import { BrowserRouter as Router, Routes,  Route, useLocation, Navigate, useParams } from 'react-router-dom'
import { userRoutes } from '../routes';
import { doConnect, doConnectDriver, onlineDrivers, checkAvatarOnline } from '../services/socket-services';
import { get_drivers, get_active_drivers, live_update_driver, live_update_destination } from '../services/firebase-services';
import { do_display_drivers, do_online_avatars, do_destination, do_refresh} from '../redux/actions'
import Banner from '../assets/nstw-banner.png'
const Login = React.lazy(() => import('../pages/Login'));

const mapState = ( state ) => {
  return {
	 		
  }
}

const mapDispatch = {
	do_display_drivers: (vals) => do_display_drivers(vals),
	do_online_avatars: (vals) => do_online_avatars(vals),
	do_destination: (vals) => do_destination(vals),
	do_refresh: () => do_refresh()
}

const connector = connect(mapState, mapDispatch)
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
class MainLayout extends React.Component{

	constructor(props){	
		super(props)

		this.state = {
				counter: 0,
				drivers: [],
				height: 0
		}

		this.elem = createRef()

	}


	componentDidMount(){
		const { do_display_drivers, do_online_avatars, do_refresh } = this.props

		get_active_drivers().then((res) => {
			if(res.length > 0){
				
				do_display_drivers(res)				
				doConnect();
				doConnectDriver();

			}			
		})

		live_update_destination((res) => {
				this.props.do_destination(res)
		})

	}

	componentDidUpdate(prevProps, prevState) {
			
			
	}

	render(){

		var is_client = localStorage.getItem('is-client');

		const { height } = this.state

		const RouteComponent = (props) => {				
		    let params = useParams()		    
		    return (
		    	<>
		    		<props.component {...params} />
		    	</>
		    ) 		    	
		}

		if(is_client == null){
				return (
						<div>
						<div id='header'>
							<nav className="navbar navbar-light bg-light">
							  <div className="container-fluid">
							    <a className="navbar-brand" href="#">Centralized Automobile Repository for Geolocated Human Assets (CARGHA)</a>
							  </div>
							</nav>
						</div>
						<Login />
					</div>
				)
		}

		return (
			<div>
				{/*<div id='header'>
					<nav className="navbar navbar-light" style={{backgroundColor: '#8660bf'}}>
					  <div className="container-fluid">
					  		<a style={{color: 'white'}} className="navbar-brand" href="#">Centralized Automobile Repository for Geolocated Human Assets (CARGHA)</a>
					  		<img src={Banner} width="200px"/>					 
					  </div>
					</nav>
				</div>*/}
				<Routes>
		            {userRoutes.map((route, index) => {
		                return (
			                  <Route
		                        key={index}
		                        path={route.path}
		                        exact={route.exact}
		                        name={route.name}
		                        element={<RouteComponent {...route} />}
		                      />
		                 )
		              })}
		          </Routes>
			</div>
		)

	}
}

export default connector(MainLayout)
