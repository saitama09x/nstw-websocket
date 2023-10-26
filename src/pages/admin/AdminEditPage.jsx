import React, { Suspense, createRef } from "react";
import { Link, Navigate } from "react-router-dom";
import { get_single_driver, upload_picture, update_photo_driver, update_single_driver } from "../../services/firebase-services"


class AdminEditPage extends React.Component{

	constructor(props){
		super(props)
		this.state = {
			profile: {
				email: '',
				fullname: '',
				photo: '',
				uid: '',
				status: false
			},
			isLoading: true
		}

		this.file = createRef()	
	}

	componentDidMount(){
		const { id } = this.props		
		get_single_driver(id).then((res) => {
			if(res){				
				this.setState({
					profile: {
						...this.state.profile,
						email: res.email,
						fullname: res.fullname,
						photo: res.photo,
						uid: res.uid,
						status: ( res.status == 1) ? true: false
					},				
					isLoading: false
				})
			}
		})
	}

	onSelectFile(){
		this.file.current.click()
	}

	onUploadFile(e){
		const { profile } = this.state
		const { files } = e.target
		var file = files[0]
		upload_picture(file).then((res) => {
			
			this.setState({
				profile: {
					...profile,
					photo: res
				}
			})

			alert("picture uploaded")

		})
	}

	onEmail(val){
		const { profile } = this.state
		this.setState({
			profile: {
				...profile,
				email: val
			}
		})
	}

	onFullname(val){
		const { profile } = this.state
		this.setState({
			profile: {
				...profile,
				fullname: val
			}
		})
	}

	onStatus(val){

		const { profile } = this.state
		this.setState({
			profile: {
				...profile,
				status: val
			}
		})

	}

	onUpdateAll(){
		const { profile } = this.state
		update_single_driver(profile.uid, profile).then((res) => {
			alert("profile updated")
		})


	}

	render(){
		const {isLoading, profile } = this.state

		if(isLoading){
			return (
				<div className='text-center'>Loading</div>
			)
		}

		const DisplaySelect = (props) => {

			if(profile.status == true){
				return (
					<select className='form-control' onChange={(e) => this.onStatus(e.target.value)}>					
						<option value={1} selected>Enable</option>
						<option value={0}>Disable</option>
					</select>
				)
			}

			return (
				<select className='form-control' onChange={(e) => this.onStatus(e.target.value)}>					
					<option value={1}>Enable</option>
					<option value={0} selected>Disable</option>
				</select>
			)
		}

		return (
			<div className='container'>
				<div className='row justify-content-center'>
					<div className='col-md-6'>
						
						<Link to={'/admin'} className='btn btn-md btn-warning mt-3'>Back</Link>

						<div className='card mt-2'>
							<div className='card-header'><h4 className='card-title'>Update Profile</h4></div>
							<div className='card-body'>
								<div className='mb-3'>
									<label>Email</label>
									<input type='text' className='form-control' defaultValue={profile.email} onChange={(e) => this.onEmail(e.target.value)}/>
								</div>
								<div className='mb-3'>
									<label>Fullname</label>
									<input type='text' className='form-control' defaultValue={profile.fullname} onChange={(e) => this.onFullname(e.target.value)} />
								</div>
								<div className='mb-3'>
									<label>Active</label>
									<DisplaySelect />
								</div>
								<div className='mb-3'>
									<div><img src={profile.photo} width="100px" className='mr-3'/></div>
									<input type='file' accept="image/*"  ref={this.file} onChange={(e) => this.onUploadFile(e) } style={{ 'position': 'absolute', 'top': '0px', 'visibility': 'hidden'}}/>
									<button type='button' className='btn btn-sm btn-primary mt-3' onClick={(e) => this.onSelectFile()}>Change Image</button>
								</div>
							</div>
							<div className='card-footer text-end'>
								<button className='btn btn-md btn-primary' onClick={(e) => this.onUpdateAll(e)}>Update</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}


}

export default AdminEditPage
