import React from "react";
import Tilt from "react-parallax-tilt";
import './Logo.css'
import brain from './brain.png'

const Logo = () => {
    return(
        <div className='ma4 mt0'>
            <Tilt className="Tilt br2 shadow-2" style={{width: '150px'}}>
                <div style={{ height: '150px', paddingTop: '5px'}}>
                    <img src={brain} alt="logo" style={{paddingTop: '20px'}}/>
                </div>
            </Tilt>
        </div>
    )
}

export default Logo;