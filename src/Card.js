import React from 'react'

function Card({ img, rotation, alt }) {

    const cardStyle = {
        transform: `rotate(${rotation}deg)`
    };
    return (
        <img className='card' src={img} alt={alt} style={cardStyle}></img>
    )
}

export default Card;