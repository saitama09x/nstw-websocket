import React, { Suspense, useState, useEffect  } from "react";
import { useSelector, useDispatch } from 'react-redux'
import {RMap, ROSM, RLayerTile, RLayerVector, RFeature, ROverlay, RStyle, useOL, RPopup, RCircle, RInteraction} from 'rlayers';
import MarkerIcon from '../assets/markers.png'
import MarkerIcon1 from '../assets/markers1.png'
import MarkerIcon2 from '../assets/markers2.png'
import MarkerIcon3 from '../assets/markers3.png'

import MarkerIcon1Op from '../assets/markers1-opacity.png'
import MarkerIcon2Op from '../assets/markers2-opacity.png'
import MarkerIcon3Op from '../assets/markers3-opacity.png'

import ExhibitIcon from '../assets/Exhibits-color1.png'
import WaveIcon from '../assets/wave-color1.png'

import Marker1 from '../assets/marker-hinablon6.png'
import Marker2 from '../assets/marker-maritime6.png'
import Marker3 from '../assets/marker-icc6.png'

import TexttileIcon from '../assets/textile-color1.png'
import RouteA from '../assets/A2B.geojson'
import C2A from '../assets/C2A.geojson'
import B2C from '../assets/B2C.geojson'
import Map from 'ol/Map';
import View from 'ol/View';
import { boundingExtent, getCenter } from "ol/extent";
import TileLayer from 'ol/layer/Tile';
import {toLonLat, transform, fromLonLat, transformExtent} from 'ol/proj';
import {toStringXY} from 'ol/coordinate.js';
import VectorLayer from 'ol/layer/Vector.js';
import VectorSource from 'ol/source/Vector.js';
import GeoJSON from "ol/format/GeoJSON";
import Feature from 'ol/Feature.js';
import Point from 'ol/geom/Point.js';
import Style from 'ol/style/Style.js';
import Icon from 'ol/style/Icon.js';
import {getArea, getLength, getDistance} from 'ol/sphere.js';
import {Fill, Stroke, Circle } from 'ol/style.js';
import {platformModifierKeyOnly, altKeyOnly, click, pointerMove, shiftKeyOnly} from 'ol/events/condition.js';
import XYZ from 'ol/source/XYZ.js';
import LayerGroup from 'ol/layer/Group.js';
import Draw, {
  createBox,
  createRegularPolygon,
} from 'ol/interaction/Draw.js';
import { OSM } from 'ol/source.js';
import "ol/ol.css";
import { streamTracking, streamOnline, streamOfflineIcon, streamAdminTracking, streamAdminOnline, streamAdminOfflineIcon } from '../services/socket-services';
import { last_location } from '../services/firebase-services';
import { do_display_drivers, do_update_lastloc } from '../redux/actions'

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'


const formatLength = function (line1, line2) {
  const length = getDistance(line1, line2);  
  let output = Math.round((length / 1000) * 100) / 100 + ' ' + 'km';  
  return output;
};


const distanceLength = function (line1, line2) {
  const length = getDistance(line1, line2);  
  let output = Math.round((length / 1000) * 100) / 100;
  return output;
};

export const TrackMap = (props) => {	
	
	const driverState = useSelector((state) => state.driver_redux )
	const dispatch = useDispatch()
	const layerRef = React.createRef();
	const [isInit, setInit] = useState(false);
	const [is_display, setDisplay] = useState(false)
	const [tooltip, setToolTip] = useState({})	
	const [distance, setDistance] = useState({})

	useEffect(() => {
			if(driverState.drivers.length && layerRef != null){					
					driverState.drivers.forEach((item) => {

							if(item.isSelected){									
									layerRef.current.ol.getView().setCenter(transform([item.pos.lng, item.pos.lat], 'EPSG:4326', 'EPSG:3857'))
									layerRef.current.ol.getView().setZoom(15); 
							}
					})

					if(!isInit){
							driverState.drivers.forEach((item, index) => {
									last_location(item.id).then((res) => {
											if(res.length){
													var last = res[res.length - 1];
													dispatch(do_update_lastloc(item.id, index, last))
											}
									})
							})
							setInit(true)
					}

			}
	})

	streamTracking((res) => {				
		var json = JSON.parse(res)
		var driver = json.driver		
		var pos = json.position
				
		var map = driverState.drivers.map((item) => {
				if(item.id == driver){
						item.pos.lat = pos.lat
						item.pos.lng = pos.lng
						item.isOnline = true
				}

				return item
		})

		dispatch(do_display_drivers(map))
	})

	streamOnline((res) => {				
			if(res){
					var json = JSON.parse(res)
					var driver = json.driver
					var pos = json.position					
					var map = driverState.drivers.map((item) => {
							if(item.id == driver){
									item.pos.lat = pos.lat
									item.pos.lng = pos.lng
									item.isOnline = true
							}

							return item
					})

					dispatch(do_display_drivers(map))
			}			
	})

	streamOfflineIcon((res) => {
			if(res){
					var json = JSON.parse(res)
					var driver = json.driver
					var pos = json.position					
					var map = driverState.drivers.map((item) => {
							if(item.id == driver){
									item.isOnline = false
							}

							return item
					})

					dispatch(do_display_drivers(map))
			}	
	})

	const extent = boundingExtent([
	  	fromLonLat([122.49797814851233, 10.67853578785413]),
	  	fromLonLat([122.62783998017737, 10.737571049506414]),
	]);

	const center = getCenter(extent);
	const exhibit = localStorage.getItem('exhibit')
	
	return (

		<RMap ref={layerRef} className='incident-map' initial={{center: center, zoom: 14}} 
		onClick={(e) => {	

				console.log(toLonLat(e.coordinate))			

				// var boundbox = layerRef.current.ol.getView().calculateExtent(layerRef.current.ol.getSize())				
				// console.log(transformExtent(boundbox, 'EPSG:3857', 'EPSG:4326'))
		}}>							 
		    <ROSM />	
		    <RLayerTile
            url="https://api.maptiler.com/maps/dataviz/256/{z}/{x}/{y}.png?key=zdGiTAfsMfXwWa5F24Rq"    
            attributions={false}        
          />
		    <RLayerVector zIndex={20}>		
		    		<RStyle.RStyle>	
		             <RStyle.RIcon src={Marker1} anchor={[0.1, 0.8]} width={200} /> 		       
		        </RStyle.RStyle>	
		        <RFeature geometry={new Point(fromLonLat([122.56823942015136,  10.70339547054904]))}>		
		        <ROverlay className="example-overlay text-center" offset={[185.0, -60.0]} autoPosition={false} positioning={'top-left'}>
	            Fibers and Textiles <br />S&T Exhibits
	          </ROverlay>
		        </RFeature>
		    </RLayerVector>  	
		    <RLayerVector zIndex={20}>		
		    		<RStyle.RStyle>	
		             <RStyle.RIcon src={Marker2} anchor={[0.2, 0.2]} width={200} /> 		       
		        </RStyle.RStyle>	
		        <RFeature geometry={new Point(fromLonLat([122.5723861279706,  10.694461824061804]))}>
			        <ROverlay className="example-overlay text-center" offset={[160.0, 0.0]} autoPosition={false} positioning={'top-left'}>
		            Maritime S&T <br /> Exhibits
		          </ROverlay>		
		        </RFeature>
		    </RLayerVector>   
		    <RLayerVector zIndex={20}>		
		    		<RStyle.RStyle>	
		             <RStyle.RIcon src={Marker3} anchor={[0.8, 0.3]} width={200} /> 		       
		        </RStyle.RStyle>	
		        <RFeature geometry={new Point(fromLonLat([122.54492431280735,  10.714660393724031]))}>
		        	<ROverlay className="example-overlay text-center" offset={[-245.0, -10.0]} autoPosition={false} positioning={'top-left'}>
		             Main S&T <br />Exhibits
		          </ROverlay>			
		        </RFeature>
		    </RLayerVector>
		    <RLayerVector
          zIndex={5}
          format={new GeoJSON({ featureProjection: "EPSG:3857" })}
          url={RouteA}
        >
          <RStyle.RStyle>
            <RStyle.RStroke color="#ffa500" width={3} />
            <RStyle.RFill color="transparent" />
          </RStyle.RStyle>
        </RLayerVector>   
         <RLayerVector
          zIndex={5}
          format={new GeoJSON({ featureProjection: "EPSG:3857" })}
          url={B2C}
        >
          <RStyle.RStyle>
            <RStyle.RStroke color="#008000" width={3} />
            <RStyle.RFill color="transparent" />
          </RStyle.RStyle>
        </RLayerVector>
         <RLayerVector
          zIndex={5}
          format={new GeoJSON({ featureProjection: "EPSG:3857" })}
          url={C2A}
        >
          <RStyle.RStyle>
            <RStyle.RStroke color="#ee82ee" width={3} />
            <RStyle.RFill color="transparent" />
          </RStyle.RStyle>
        </RLayerVector>
		     {
		    		(driverState.drivers.length) ? driverState.drivers.map((item, index) => {

		    				return (
		    					<RLayerVector zIndex={10} key={'marker-' + index}>							        
						        <RStyle.RStyle>	
						        { (item.exhibit == 'icc' && item.isOnline) ? <RStyle.RIcon src={MarkerIcon1} anchor={[0.5, 0.8]} width={40} />: <></> }
						        { (item.exhibit == 'maritime' && item.isOnline) ? <RStyle.RIcon src={MarkerIcon2} anchor={[0.5, 0.8]} width={40} />: <></> }
						        { (item.exhibit == 'hinablon' && item.isOnline) ? <RStyle.RIcon src={MarkerIcon3} anchor={[0.5, 0.8]} width={40} />: <></> }
						        
						        { (item.exhibit == 'icc' && !item.isOnline) ? <RStyle.RIcon src={MarkerIcon1Op} anchor={[0.5, 0.8]} width={40} />: <></> }
						        { (item.exhibit == 'maritime' && !item.isOnline) ? <RStyle.RIcon src={MarkerIcon2Op} anchor={[0.5, 0.8]} width={40} />: <></> }
						        { (item.exhibit == 'hinablon' && !item.isOnline) ? <RStyle.RIcon src={MarkerIcon3Op} anchor={[0.5, 0.8]} width={40} />: <></> }
						        
						        { (item.exhibit == '') ? <RStyle.RIcon src={MarkerIcon} anchor={[0.5, 0.8]} width={40} />: <></> }
						        </RStyle.RStyle>							        
						        <RFeature geometry={new Point(fromLonLat([item.pos.lng, item.pos.lat]))} onChange={(e) => {
						        		const geom = e.target.getGeometry();						        		
						        		tooltip[item.id] = formatLength([item.dest.lng, item.dest.lat], [item.pos.lng, item.pos.lat])								        		
						        		distance[item.id] = distanceLength([item.dest.lng, item.dest.lat], [item.pos.lng, item.pos.lat])
						        		setToolTip(tooltip)		
						        		setDistance(distance)				        		
						        		// if(item.exhibit == exhibit){
						        		// 		setDistance(distance)
						        		// }

						        }}>			
							        {
							        	(item.dest.lng != 0.0 && item.dest.lat != 0.0) ? 
							        		<ROverlay className="example-overlay" offset={[-30.0, -70.0]} positioning={'top-left'}>
								            	{tooltip[item.id]}
								          </ROverlay>	: <></>
							        }							       
						        	<RPopup trigger={"hover"} className="example-overlay">
						        		<div className="card p-0">
				              		<div className="card-body p-0">{item.email}</div>
				              	</div>
						        	</RPopup>		       				            							          
						        </RFeature>
						   		</RLayerVector>

		    				)
		    		}): <></>
		    }		   					    		   
		</RMap>

	)
}


export const TrackMap2 = (props) => {	
	
	const driverState = useSelector((state) => state.driver_redux )
	const dispatch = useDispatch()
	const layerRef = React.createRef();
	const [isInit, setInit] = useState(false);
	const [is_display, setDisplay] = useState(false)
	const [tooltip, setToolTip] = useState({})	
	const [distance, setDistance] = useState({})

	useEffect(() => {
			if(driverState.drivers.length && layerRef != null){					
					driverState.drivers.forEach((item) => {

							if(item.isSelected){									
									layerRef.current.ol.getView().setCenter(transform([item.pos.lng, item.pos.lat], 'EPSG:4326', 'EPSG:3857'))
									layerRef.current.ol.getView().setZoom(15); 
							}
					})

					if(!isInit){
							driverState.drivers.forEach((item, index) => {
									last_location(item.id).then((res) => {
											if(res.length){
													var last = res[res.length - 1];
													dispatch(do_update_lastloc(item.id, index, last))
											}
									})
							})
							setInit(true)
					}
					
			}
	})

	streamAdminTracking((res) => {				
		var json = JSON.parse(res)
		var driver = json.driver		
		var pos = json.position
				
		var map = driverState.drivers.map((item) => {
				if(item.id == driver){
						item.pos.lat = pos.lat
						item.pos.lng = pos.lng
						item.isOnline = true
				}

				return item
		})

		dispatch(do_display_drivers(map))
	})

	streamAdminOnline((res) => {				
			if(res){
					var json = JSON.parse(res)
					var driver = json.driver
					var pos = json.position					
					var map = driverState.drivers.map((item) => {
							if(item.id == driver){
									item.pos.lat = pos.lat
									item.pos.lng = pos.lng
									item.isOnline = true
							}

							return item
					})

					dispatch(do_display_drivers(map))
			}			
	})

	streamAdminOfflineIcon((res) => {
			if(res){
					var json = JSON.parse(res)
					var driver = json.driver
					var pos = json.position					
					var map = driverState.drivers.map((item) => {
							if(item.id == driver){
									item.isOnline = false
							}

							return item
					})

					dispatch(do_display_drivers(map))
			}	
	})

	const extent = boundingExtent([
	  	fromLonLat([122.49797814851233, 10.67853578785413]),
	  	fromLonLat([122.62783998017737, 10.737571049506414]),
	]);

	const center = getCenter(extent);
	const exhibit = localStorage.getItem('exhibit')
	
	return (

		<RMap ref={layerRef} className='incident-map' initial={{center: center, zoom: 14}} 
		onClick={(e) => {	

				console.log(toLonLat(e.coordinate))			

				// var boundbox = layerRef.current.ol.getView().calculateExtent(layerRef.current.ol.getSize())				
				// console.log(transformExtent(boundbox, 'EPSG:3857', 'EPSG:4326'))
		}}>							 
		    <ROSM />	
		    <RLayerTile
            url="https://api.maptiler.com/maps/dataviz/256/{z}/{x}/{y}.png?key=zdGiTAfsMfXwWa5F24Rq"    
            attributions={false}        
          />
		    <RLayerVector zIndex={20}>		
		    		<RStyle.RStyle>	
		             <RStyle.RIcon src={Marker1} anchor={[0.1, 0.8]} width={200} /> 		       
		        </RStyle.RStyle>	
		        <RFeature geometry={new Point(fromLonLat([122.56823942015136,  10.70339547054904]))}>		
		        <ROverlay className="example-overlay text-center" offset={[185.0, -60.0]} autoPosition={false} positioning={'top-left'}>
	            Fibers and Textiles <br />S&T Exhibits
	          </ROverlay>
		        </RFeature>
		    </RLayerVector>  	
		    <RLayerVector zIndex={20}>		
		    		<RStyle.RStyle>	
		             <RStyle.RIcon src={Marker2} anchor={[0.2, 0.2]} width={200} /> 		       
		        </RStyle.RStyle>	
		        <RFeature geometry={new Point(fromLonLat([122.5723861279706,  10.694461824061804]))}>
			        <ROverlay className="example-overlay text-center" offset={[160.0, 0.0]} autoPosition={false} positioning={'top-left'}>
		            Maritime S&T <br /> Exhibits
		          </ROverlay>		
		        </RFeature>
		    </RLayerVector>   
		    <RLayerVector zIndex={20}>		
		    		<RStyle.RStyle>	
		             <RStyle.RIcon src={Marker3} anchor={[0.8, 0.3]} width={200} /> 		       
		        </RStyle.RStyle>	
		        <RFeature geometry={new Point(fromLonLat([122.54492431280735,  10.714660393724031]))}>
		        	<ROverlay className="example-overlay text-center" offset={[-245.0, -10.0]} autoPosition={false} positioning={'top-left'}>
		             Main S&T <br />Exhibits
		          </ROverlay>			
		        </RFeature>
		    </RLayerVector>
		    <RLayerVector
          zIndex={5}
          format={new GeoJSON({ featureProjection: "EPSG:3857" })}
          url={RouteA}
        >
          <RStyle.RStyle>
            <RStyle.RStroke color="#ffa500" width={3} />
            <RStyle.RFill color="transparent" />
          </RStyle.RStyle>
        </RLayerVector>   
         <RLayerVector
          zIndex={5}
          format={new GeoJSON({ featureProjection: "EPSG:3857" })}
          url={B2C}
        >
          <RStyle.RStyle>
            <RStyle.RStroke color="#008000" width={3} />
            <RStyle.RFill color="transparent" />
          </RStyle.RStyle>
        </RLayerVector>
         <RLayerVector
          zIndex={5}
          format={new GeoJSON({ featureProjection: "EPSG:3857" })}
          url={C2A}
        >
          <RStyle.RStyle>
            <RStyle.RStroke color="#ee82ee" width={3} />
            <RStyle.RFill color="transparent" />
          </RStyle.RStyle>
        </RLayerVector>
		     {
		    		(driverState.drivers.length) ? driverState.drivers.map((item, index) => {

		    				return (
		    					<RLayerVector zIndex={10} key={'marker-' + index}>							        
						        <RStyle.RStyle>	
						        { (item.exhibit == 'icc' && item.isOnline) ? <RStyle.RIcon src={MarkerIcon1} anchor={[0.5, 0.8]} width={40} />: <></> }
						        { (item.exhibit == 'maritime' && item.isOnline) ? <RStyle.RIcon src={MarkerIcon2} anchor={[0.5, 0.8]} width={40} />: <></> }
						        { (item.exhibit == 'hinablon' && item.isOnline) ? <RStyle.RIcon src={MarkerIcon3} anchor={[0.5, 0.8]} width={40} />: <></> }
						        
						        { (item.exhibit == 'icc' && !item.isOnline) ? <RStyle.RIcon src={MarkerIcon1Op} anchor={[0.5, 0.8]} width={40} />: <></> }
						        { (item.exhibit == 'maritime' && !item.isOnline) ? <RStyle.RIcon src={MarkerIcon2Op} anchor={[0.5, 0.8]} width={40} />: <></> }
						        { (item.exhibit == 'hinablon' && !item.isOnline) ? <RStyle.RIcon src={MarkerIcon3Op} anchor={[0.5, 0.8]} width={40} />: <></> }
						        
						        { (item.exhibit == '') ? <RStyle.RIcon src={MarkerIcon} anchor={[0.5, 0.8]} width={40} />: <></> }
						        </RStyle.RStyle>							        
						        <RFeature geometry={new Point(fromLonLat([item.pos.lng, item.pos.lat]))} onChange={(e) => {
						        		const geom = e.target.getGeometry();						        		
						        		tooltip[item.id] = formatLength([item.dest.lng, item.dest.lat], [item.pos.lng, item.pos.lat])								        		
						        		distance[item.id] = distanceLength([item.dest.lng, item.dest.lat], [item.pos.lng, item.pos.lat])
						        		setToolTip(tooltip)		
						        		setDistance(distance)				        		
						        		// if(item.exhibit == exhibit){
						        		// 		setDistance(distance)
						        		// }

						        }}>			
							        {
							        	(item.dest.lng != 0.0 && item.dest.lat != 0.0) ? 
							        		<ROverlay className="example-overlay" offset={[-30.0, -70.0]} positioning={'top-left'}>
								            	{tooltip[item.id]}
								          </ROverlay>	: <></>
							        }							       
						        	<RPopup trigger={"hover"} className="example-overlay">
						        		<div className="card p-0">
				              		<div className="card-body p-0">{item.email}</div>
				              	</div>
						        	</RPopup>		       				            							          
						        </RFeature>
						   		</RLayerVector>

		    				)
		    		}): <></>
		    }		   					    		   
		</RMap>

	)
}


export const DrawMap = (props) => {	

	const layerRef = React.createRef();
	const [latlng, setLatlng] = useState([])
	const extent = boundingExtent([
	  	fromLonLat([122.49797814851233, 10.67853578785413]),
	  	fromLonLat([122.62783998017737, 10.737571049506414]),
	]);

	const center = getCenter(extent);

	useEffect(() => {
			
	})

	

	return (		

		<RMap ref={layerRef} className='incident-map' initial={{center: center, zoom: 14}} 
		onClick={(e) => { console.log(toLonLat(e.coordinate))	}}>	

				<ROSM />
				<RLayerVector>
					<RStyle.RStyle>
	          <RStyle.RStroke color="#0000ff" width={3} />
	          <RStyle.RFill color="rgba(0, 0, 0, 0.75)" />
	        </RStyle.RStyle>

	        <RInteraction.RDraw
	          type={"LineString"}
	          condition={shiftKeyOnly}
	          freehandCondition={shiftKeyOnly}
	          onDrawStart={(draw, evt) => {
	          		console.log(draw)
	          }}
	          onDrawEnd={(draw, evt) => {
	          		console.log(draw)
	          }}
        	/>

        	<RInteraction.RModify
            condition={platformModifierKeyOnly}
            deleteCondition={React.useCallback(
              (e) => platformModifierKeyOnly(e) && click(e),
              []
            )}
          />
        </RLayerVector>
		</RMap>

		)

}


export const DrawMap2 = (props) => {	

	const { markers } = props

	const layerRef = React.createRef();
	const [latlng, setLatlng] = useState([])
	const extent = boundingExtent([
	  	fromLonLat([122.49797814851233, 10.67853578785413]),
	  	fromLonLat([122.62783998017737, 10.737571049506414]),
	]);

	const center = getCenter(extent);

	useEffect(() => {
			
	})

		return (		

			<RMap ref={layerRef} className='incident-map' initial={{center: center, zoom: 14}} 
			onClick={(e) => { console.log(toLonLat(e.coordinate))	}}>	

					<ROSM />
					 <RLayerTile
            properties={{ label: "OpenTopo" }}
            url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
            attributions="Kartendaten: © OpenStreetMap-Mitwirkende, SRTM | Kartendarstellung: © OpenTopoMap (CC-BY-SA)"
          />
					 <RLayerVector
		          zIndex={5}
		          format={new GeoJSON({ featureProjection: "EPSG:3857" })}
		          url={RouteA}
		        >
		          <RStyle.RStyle>
		            <RStyle.RStroke color="#007bff" width={3} />
		            <RStyle.RFill color="transparent" />
		          </RStyle.RStyle>
		        </RLayerVector>
		        {
		    		(markers.length) ? markers.map((item, index) => {		    						    				
		    				return (
		    					<RLayerVector zIndex={10} key={'layer-'+index}>							        
						        <RStyle.RStyle>							            
						             <RStyle.RIcon src={MarkerIcon} anchor={[0.5, 0.8]} width={40} /> 
						        </RStyle.RStyle>							        
						        <RFeature geometry={new Point(fromLonLat([item.lng, item.lat]))}>		
						        <ROverlay className='example-overlay'>
				                {item.date}
				            </ROverlay>								        		       				            							          
						        </RFeature>
						   		</RLayerVector>

		    				)
		    		}): <></>
		    }	
			</RMap>

		)

}


