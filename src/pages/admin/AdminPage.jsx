import React, { Suspense, createRef } from "react";
import { Link, Navigate } from "react-router-dom";
import { Transition } from 'react-transition-group';
import { get_drivers, update_status_driver } from "../../services/firebase-services"

class AdminPage extends React.Component{

	constructor(props){
		super(props)
		this.state = {
			drivers: [],
			show_modal: false,
			exhibit: 'icc'
		}	
	}

	componentDidMount(){
		get_drivers().then((res) => {
			if(res){
				this.setState({
					drivers: res
				})
			}
		})
	}

	onUpdateStatus(id, val){ 
		var status = 1
		if(val == "1"){
			status = 0
		}

		update_status_driver(id, status).then((res) => {
			get_drivers().then((res) => {
				if(res){
					this.setState({
						drivers: res
					})
				}
			})
		})
	}

	onShowModal(){
		const { show_modal } = this.state		
		this.setState({
			show_modal: !show_modal
		})
	}

	onSelectLoc(val){

		this.setState({
			exhibit: val
		})

	}

	onSubmitLoc(){
		const { exhibit } = this.state
		localStorage.setItem('exhibit', exhibit)
		this.setState({
			show_modal: false
		})
	}

	render(){
		const { drivers } = this.state

		const DriveRow = (props) => {
			if(!drivers.length){
				return (
					<tr>
						<td colSpan='4'>No Record</td>
					</tr>
				)
			}

			return drivers.map((item, index) => {				
				return (
					<tr key={'row-' + index}>
						<td>{item.name}</td>
						<td>{item.email}</td>
						<td><img src={item.photo} width="50px" /></td>
						<td>{ ( item.status == 1) ? "Enabled": "Disabled" }</td>
						<td>						
							<Link to={'/admin/edit/' + item.id} className="btn btn-sm btn-primary mb-2">Edit</Link>
							{
								(item.status == "1") ? <button className='btn btn-sm btn-danger' 
								onClick={(e) => this.onUpdateStatus(item.id, item.status)}>Disable</button> : 
								<button className='btn btn-sm btn-warning' 
								onClick={(e) => this.onUpdateStatus(item.id, item.status)}>Enable</button> 
							}
						</td>
					</tr>
				)
			})
		}

		const ModalCom = (props) => {
			
			const nodeRef = createRef()

			const { title, modal, onClose, onSubmit, isShow } = props

			const defaultStyle = {
			  transform: "translate(0,-25%)"	  
			}

			const modalStyle = {
				display: 'none'
			}

			const transitionStyles = {
			  entering: { transform: "translate(0,-25%)" },
			  entered:  { transform: "translate(0,0)"},
			  exiting:  { transform: "translate(0,-25%)" },
			  exited:  { transform: "translate(0,-25%)" },
			};

			const modalStyles = {
			  entering: { display: 'block' },
			  entered:  { display: 'block'},
			  exiting:  { display: 'block' },
			  exited:  { display: 'none'  },
			}

			return(

				<Transition nodeRef={nodeRef} in={isShow} timeout={{
					 appear: 100,
					 enter: 0,
					 exit: 100,
					}}>
					{state => (
					<div id="modal-com" ref={nodeRef} data-attr={state} style={{
						...modalStyle,
						...modalStyles[state]
					}}>
						<div className="backdrop"></div>
						<div className='modal-main' style={{
							  ...defaultStyle,
					          ...transitionStyles[state]
					        }}>
							<div className='modal-header'><h3 className='modal-title'>{title}</h3></div>
							<div className='modal-body'>
								{props.children}
							</div>
							<div className='modal-footer'>
								<button type='button' className='btn btn-md btn-warning me-2' onClick={(e) => onClose() }>Close</button>
								<button type='button' className='btn btn-md btn-primary' onClick={(e) => onSubmit() }>Submit</button>
							</div>
						</div>
					</div>
					)}
				</Transition>
			)

		}

		var loc = localStorage.getItem('exhibit');

		return (
			<div className='container'>
				<div className='row justify-content-center mt-5'>
					<div className='col-md-6'>
						{/*<div className='row my-2'>
							<div className='col-md-6'>
								<h5>Location: {loc}</h5>
							</div>
							<div className='col-md-6 text-end'>
								<button className='btn btn-md btn-primary' onClick={(e) => this.onShowModal() }>Set Default Location</button>
							</div>
						</div>*/}
						
						<Link to={'/admin/map'} className="btn btn-md btn-primary mb-3">Map</Link>

						<div className='card'>
							<div className='card-body'>
								<table id='table' className='table'>
									<thead><tr><th>Driver</th><th>Email</th><th>Photo</th><th>Status</th><th>Action</th></tr></thead>
									<tbody>
										<DriveRow />
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
				<ModalCom 
					title="Set Default Location" 
					isShow={this.state.show_modal} 
					onClose={(e) => this.onShowModal() }
					onSubmit={(e) => this.onSubmitLoc()}
				>
					<div className='mb-3'>
						<select className='form-control' defaultValue={this.state.exhibit} onChange={(e) => this.onSelectLoc(e.target.value)}>
							<option value="">Please Select</option>
							<option value="icc">ICC</option>
							<option value="hinablon">Hinablon</option>
							<option value="maritime">Maritime</option>
						</select>
					</div>
				</ModalCom>
			</div>
		)
	}
}

export default AdminPage
