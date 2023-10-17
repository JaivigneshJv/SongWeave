import React from 'react'
import { BiSkipNext, BiSkipPrevious, BiPause, BiPlay } from "react-icons/bi";

const Controls = (props) => {
  return (
    <div>
        <div className="controls">
        <BiSkipPrevious className="player__button"  onClick={() => props.SkipSong(false)}/>
        
        {props.isPlaying ? (<BiPause className="player__button" onClick={() => props.setIsPlaying(!props.isPlaying)}/>) : (<BiPlay className="player__button" onClick={() => props.setIsPlaying(!props.isPlaying)}/>)}
        <BiSkipNext className="player__button" onClick={() => props.SkipSong()} />
      </div>
    </div>
  )
}

export default Controls