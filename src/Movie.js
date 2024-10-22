import {useState,useEffect, useRef} from 'react';
import {Card,Button} from 'react-bootstrap';
import {useParams} from 'react-router-dom';
import {fetchMovieById} from './Data';
import {AiFillHeart} from 'react-icons/ai';
import {useAuth} from './Contexts/AuthContext';
import NavBar from './NavBar';
import Posts from './Posts';
import Warning from './Warning';
export default function Movie()
{
    const {movieId}  = useParams();
    const [movie,setMovie] = useState();
    const {userid,useremail} = useAuth();
    useEffect(async ()=>
    {
        if(userid)
        {
         const result = await fetchMovieById(movieId);
         setMovie(result);
        }
    },[]);
    const percent=(x)=>
    {
        var index = x.indexOf("/");
        var str = x.substring(0,index);
        const ans = Number(str)*10;
        return ans;
    }
    if(userid)
    {
    return(
        movie ? 
          <>
          <NavBar/>
          <div className='movie-container'>
              <img src={movie.image} style={{width:"20vw",height:"100%"}}></img>
              <div className='movie-details'>    
              <h1>{movie.titleOriginal}</h1>
              <div>
              <AiFillHeart color="red" className='heart'/>
              <p style={{display:"inline",marginLeft:"4px"}}>{percent(movie.rating)}%</p>
              </div>
              <p>{movie.description}</p>
              <div style={{display:"flex",justifyContent:"space-evenly"}}>
                  {
                      movie.genres.map((genre)=><div><h3>{genre.name}</h3></div>)
                  }
              </div>
              </div>
          </div>
          <Posts movieId={movieId} userid={userid} useremail={useremail}/>
          </>   :  <Warning text="Loading..."  color="#56d696"/>     
    )
   }
   else
   {
       return <Warning text="Sign in to Access this Page." color="#eb4034"/>
   }

}