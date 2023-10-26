import React, { Suspense, createRef } from "react";
import { Link, Navigate } from "react-router-dom";
import { InputField } from "../../components/fieldcom"
import { admin_login } from "../../services/firebase-services"

class AdminLogin extends React.Component{

	constructor(props){
		super(props)
		this.state = {
			fields: {
				username: '',
				password: ''
			},
			invalid_login: false
		}		
	}

	onSetUname(val){
		const { fields } = this.state

		this.setState({
			fields: {
				...fields,
				username: val
			}			
		})
	}

	onSetPass(val){
		
		const { fields } = this.state

		this.setState({
			fields: {
				...fields,
				password: val
			}
		})
	}

	onSubmit(){
		const { fields } = this.state
		
		this.setState({
			invalid_login: false
		})

		admin_login(fields.username, fields.password).then((res) => {
			if(res == 1){
				localStorage.setItem('is-admin', true)
				window.location.href = "/admin"
			}else{
				this.setState({
					invalid_login: true
				})
			}
		})
	}

	render(){
		const { invalid_login } = this.state

		return (
			<div className='container'>
				<div className='row justify-content-center'>
					<div className='col-md-6'>
						<div className='card mt-5'>
							<div className='card-header'><h5 className='card-title'>Login</h5></div>
							<div className='card-body'>
								{
									(invalid_login) ? <div className="alert alert-danger" role="alert">
										  Invalid Login
										</div> : <span></span>
								}
								<InputField type="text" label="Username" placeholder="Username" value="" onChange={(e) => this.onSetUname(e)}/>
								<InputField type="password" label="Password" placeholder="Password" value="" onChange={(e) => this.onSetPass(e)} />
							</div>
							<div className='card-footer text-end'>
								<button className='btn btn-md btn-primary' onClick={(e) => this.onSubmit() }>Login</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default AdminLogin