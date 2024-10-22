import {Form,Button, NavItem} from 'react-bootstrap';
import {Link, useNavigate} from 'react-router-dom';
import { useEffect, useRef,useState} from 'react';
import {useAuth} from './Contexts/AuthContext';
import {auth} from './firebase';
import { onAuthStateChanged, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth';
export default function SignUp()
{
    const emailaddressref = useRef();
    const passwordref = useRef();
    const [error,setError] = useState("");
    const {signin,signout} = useAuth();
    const [passwordresetlink,setPasswordResetLink] = useState(false);
    const navigate = useNavigate();
    useEffect(()=>
    {
          const unsubscribe = onAuthStateChanged(auth,(user)=>
          {
              if(!user){return;}
              if(user.emailVerified){navigate("/dashboard");}
              else{signout(user);setError("Email Not yet Verified");}
         });
         return unsubscribe;
    },[]);
    const focusEvent=(e)=>
    {
        setError("");
    }
    const submitHandler = async (e)=>
    {
        try
        {
          e.preventDefault();
          await signin(emailaddressref.current.value,passwordref.current.value);
        }
        catch(err)
        {
            setError(err.message);
            passwordref.current.value='';
        }
    }
    const checkError= ()=>{return error.length!=0 ? "red":"rgba(12, 173, 232,1)"}
    return(
        <>
        <div className="container">
            <h1>SignIn</h1>
            <Form style={{padding:"2vw",width:"50%",border:"2px solid "+checkError(),borderRadius:"4px"}}>
                <Form.Group className='m-3'>
                    <label htmlFor="email">Email Address</label>
                    <Form.Control ref={emailaddressref} type="email" name="email" autoComplete='off' onFocus={focusEvent}/>
                </Form.Group>
                <Form.Group className='m-3'>
                    <label htmlFor="pss">Password</label>
                    <Form.Control type="password" ref={passwordref} name="pss" autoComplete='off' onFocus={focusEvent}/>
                </Form.Group>
                 <h6 className='m-3' style={{textAlign:"center",cursor:"pointer",padding:"0.5vw"}} onClick={(e)=>{navigate("/ProfileSettings/forgotPassword")}}>Forgot Password?</h6>
                {
                    error=="Email Not yet Verified" && 
                 <h6 className='m-3' style={{textAlign:"center",backgroundColor:"#8febb8",padding:"0.5vw"}}>Check your Inbox</h6>
                }
                <Button className='m-3' onClick={submitHandler}>SignIn</Button>
            </Form>
            <p>Dont Have an Account ? <Link to='/'>SignUp</Link></p>
            {
                error.length!=0 && 
                <h4 style={{textAlign:"center",backgroundColor:"#f2888b",padding:"1vw",borderRadius:"4px"}}>{error}</h4>
            }
        </div>
        </>
    )
}