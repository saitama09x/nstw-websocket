import React, { Suspense, createRef } from "react";


export const InputField = (props) => {
	
	const { label, value, type, placeholder, onChange } = props

	return (

		<div className="form-floating mb-3">
		  <input type={type} className="form-control" id="floatingInput" placeholder={placeholder} onChange={(e) => onChange(e.target.value)}/>
		  <label htmlFor="floatingInput">{label}</label>
		</div>

	)

}