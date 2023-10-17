import React from 'react'

const Details = (props) => {
    console.log(props.img_src)
  return (
    <>
    <div className="player__image">
        <img className="player__img" src={props.song.img_src} alt="album cover" />
      </div>
      <div className="details">
        <h3 className="player__title">{props.song.title}</h3>
      </div>
    </>  
  )
}

export default Details