import {useState} from 'react';


export default function Warning({text,color})
{
    return <h3 className='loading animate' style={{backgroundColor:color,padding:"2vw",borderRadius:"4px"}}>{text}</h3>; 
}