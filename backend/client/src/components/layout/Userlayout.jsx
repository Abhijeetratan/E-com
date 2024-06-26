import React, { Children } from 'react'
import SideMenu from './SideMenu'

function Userlayout({children}) {
  return (
    <div>
        <div className='mt-2 mb-4 py-4'>
            <h2 className='text-center fw-bolder'>User Setting</h2>
            <div className='container'>
                <div className='row justify-content-around'>
                <div className='col-12 col-lg-3'>
                    <SideMenu/>
                </div>
                <div className='col-12 col-lg-8 user-dashboard'>{children}</div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Userlayout