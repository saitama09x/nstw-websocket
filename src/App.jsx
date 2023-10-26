import React, { Suspense } from "react";
import MainLayout from './layout/MainLayout'
import AdminLayout from './layout/AdminLayout'
import {BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom'

class App extends React.Component{

  constructor(props){
      super(props)
  }

  componentDidMount(){

  }

  render(){

      const Loader = () => {
        return (
            <div style={{ display: 'flex', flexWrap:'wrap', justifyContent:'center', marginTop:'30px'}}>
              <p className='text-center'>Please Wait...</p>
            </div>
        )
      }

      return (
          <div>
             <Router>
              <Suspense fallback={<Loader />}>
                <Routes>
                  <Route path={ "/*" } element={<MainLayout />} />                  
                  <Route path={ "/admin/*" } element={<AdminLayout />} />
                </Routes>
              </Suspense>
            </Router>
          </div>
      )
  }
}

export default App;
