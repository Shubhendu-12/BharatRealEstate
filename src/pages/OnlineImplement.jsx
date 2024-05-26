import React from 'react'
import CheckOnline from './CheckOnline'


const OnlineImplement = () => {
    const online = CheckOnline();

    if (!online) {
        return(
            <h1> Your'e offline</h1> 
        )
        
    }
  return (
    <div>
      
    </div>
  )
}

export default OnlineImplement
