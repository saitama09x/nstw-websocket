import React, { Suspense, createRef } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { connect, ConnectedProps, useDispatch } from 'react-redux'
import { BrowserRouter as Router, Routes,  Route, useLocation, Navigate, useParams, Link} from 'react-router-dom'
import { adminRoutes } from '../routes';
import { doConnect, doConnectDriver, onlineDrivers, checkAvatarOnline } from '../services/socket-services';
import { get_drivers, get_active_drivers, live_update_driver, live_update_destination } from '../services/firebase-services';
import { do_display_drivers, do_online_avatars, do_destination, do_refresh} from '../redux/actions'
import Banner from '../assets/nstw-banner.png'
const AdminLogin = React.lazy(() => import('../pages/admin/AdminLogin'));

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
class AdminLayout extends React.Component{

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

				var result_arr = []
				res.forEach((item) => {
					result_arr.push({
						id: item.id,
						photo: item.photo,
						is_online: false,
						isSelected: false
					})
				})
				
				do_online_avatars(result_arr)
			}			
		})	

		live_update_driver((res) => {	
				
				do_display_drivers(res)

				var result_arr = []
				res.forEach((item) => {
					result_arr.push({
						id: item.id,
						photo: item.photo,
						is_online: false,
						isSelected: false
					})
				})

				do_online_avatars(result_arr)

		})

		live_update_destination((res) => {
				this.props.do_destination(res)
		})
		
		setInterval(function(){
													  					
				checkAvatarOnline()

		}, 50000)

	}

	shouldComponentUpdate(nextProps, nextState){
			if(this.state.counter != nextState.counter){
					
			}
			return true
	}

	componentDidUpdate(prevProps, prevState) {
			
			
	}

	render(){

		var is_admin = localStorage.getItem('is-admin');

		const { height } = this.state

		const RouteComponent = (props) => {				
		    let params = useParams()		    
		    return (
		    	<>
		    		<props.component {...params} />
		    	</>
		    ) 		    	
		}

		if(is_admin == null){
				return (
						<div>
						<div id='header'>
							<nav className="navbar navbar-light bg-light">
							  <div className="container-fluid">
							    <a className="navbar-brand" href="#">Centralized Automobile Repository for Geolocated Human Assets (CARGHA)</a>
							  </div>
							</nav>
						</div>
						<AdminLogin />
					</div>
				)
		}

		return (
			<div>
				<div id='header'>
					<nav className="navbar navbar-light" style={{backgroundColor: '#8660bf'}}>
					  <div className="container-fluid justify-content-between">
					  		<a style={{color: 'white'}} className="navbar-brand" href="#">Centralized Automobile Repository for Geolocated Human Assets (CARGHA)</a>		 
			  				<div>
			  				<Link className="btn btn-md btn-primary me-2" to={"/admin"}>Home</Link>
			  				<button className="btn btn-md btn-danger" onClick={(e) => {
			  						localStorage.clear()
										window.location.href = "/admin"
			  				}}>Logout</button>
			  				</div>
					  </div>
					</nav>
				</div>
				<Routes>
		            {adminRoutes.map((route, index) => {
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

export default connector(AdminLayout)
