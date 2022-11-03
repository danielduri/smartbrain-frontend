import React from "react";
import "./FaceRecognition.css"

const FaceRecognition = ({ imageURL, box }) => {
    let faceBoxes = [];
    let i=0;

    for (const boxItem of box) {
        faceBoxes.push(<div key={'face'+i} className={'bounding-box'} style={{top: boxItem.topRow, right: boxItem.rightCol, bottom: boxItem.bottomRow, left: boxItem.leftCol}}></div>);
        i++;
    }

    return(
        <div className='center ma'>
            <div className={'absolute mt2'}>
                {imageURL!=='' ? <img src={imageURL} alt={'Sent'} width={'500px'} height={'auto'} id={'inputImage'}/> : <div></div>}
                {faceBoxes}
            </div>

        </div>
    )

}

export default FaceRecognition;