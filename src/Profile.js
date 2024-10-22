import {Navigate, useNavigate, useParams} from 'react-router-dom';
import {Container,Form,Button} from 'react-bootstrap';
import {auth} from './firebase';
import {useState,useEffect, useRef} from 'react';
import {AiFillHome} from 'react-icons/ai';
import {deletePostsByUser,deleteCommentsByUser,deleteLikesByUser,deleteSubscriptionsByUser,deleteSavedPostsByUser} from './Data';
import {onAuthStateChanged, reauthenticateWithCredential, updatePassword,EmailAuthProvider, deleteUser, updateProfile,sendPasswordResetEmail} from 'firebase/auth';
import Warning from './Warning';
export default function Profile()
{
    const {changeOption} = useParams();
    const oldpasswordref = useRef();
    const newpasswordref = useRef();
    const usernameref = useRef();
    const emailAddressRef=useRef();
    const user = auth.currentUser;
    const [passwordchanged,setPasswordChanged] = useState(false);
    const [deletedAccount,setDeletedAccount] = useState(false);
    const [usernamechanged,setUsernamechanged] = useState(false);
    const [error,setError]  = useState("");
    const navigate  = useNavigate();
    const [passwordlink,setPasswordResetLink]=useState(false);
    if(!user && !deletedAccount && changeOption!="forgotPassword")
    {
        return <h1 style={{ textAlign: "center" }}>SignIn to Access this Page</h1>
    }
    const changePassword=async (e)=>
    {
        e.preventDefault();
        try
        {
         const credential = EmailAuthProvider.credential(
            user.email, 
            oldpasswordref.current.value
         );
         await reauthenticateWithCredential(user,credential);
         await updatePassword(user,newpasswordref.current.value);
         setPasswordChanged(true);
        }
        catch(err)
        {
            setError(err.message);
            oldpasswordref.current.value='';
            newpasswordref.current.value='';
        }
    }
    const changeUserName=async (e)=>
    {
        e.preventDefault();
        updateProfile(auth.currentUser,{displayName:usernameref.current.value});
        setUsernamechanged(true);
    }
    const deleteAccount=async (e)=>
    {
        e.preventDefault();
        try
        {
         const credential = EmailAuthProvider.credential(
            user.email, 
            oldpasswordref.current.value
         );
         await deletePostsByUser(user.email);
         await deleteLikesByUser(user.uid);
         await deleteCommentsByUser(user.email);
         await reauthenticateWithCredential(user,credential);
         await deleteUser(user);
         setDeletedAccount(true);
         }
         catch(err)
         {
             setError(err.message);
             oldpasswordref.current.value='';
         }
    }
    const focusEvent=(e)=>
    {
        setError("");
    }
    const recoverPassword=async (e)=>
    {
        try
        {
         e.preventDefault();
         if(emailAddressRef.current.value=='')
         {
            alert("Provide Email Address");
            return;
         }
         sendPasswordResetEmail(auth,emailAddressRef.current.value);
         setPasswordResetLink(true);
        }
        catch(err)
        {
            setError(err.message);
            emailAddressRef.current.value='';
        }
    }
    if(changeOption=="password")
    {
       return(
        !passwordchanged ? <Container style={{}}>
            <h3>Profile Settings</h3>
            <Form>
            <Form.Group style={{marginTop:"2vw",marginBottom:"2vw"}}>
                   <label htmlFor="password">Enter Old Password</label>
                   <Form.Control ref={oldpasswordref} type="password" name="password" onFocus={focusEvent}></Form.Control>
               </Form.Group>
               <Form.Group style={{marginTop:"2vw"}}>
                   <label htmlFor="password">Enter New Password</label>
                   <Form.Control ref={newpasswordref} type="password" name="password" onFocus={focusEvent}></Form.Control>
               </Form.Group>
               <Button style={{marginTop:"2vw"}} onClick={changePassword}>Change Password</Button>
            </Form>
            {
              error.length!=0 && <h3 style={{backgroundColor:"#f2888b",padding:"0.2vw",borderRadius:"4px",marginTop:"4vw",padding:'1vw'}}>{error}</h3>
            }
        </Container> 
        : <Warning color="#56d696" text="Successfully changed the Password"/>
    )
    }
    else if(changeOption=='username')
    {
        return(
            !usernamechanged ? 
            <Container>
                <h3>Profile Settings</h3>
                <Form>
                   <Form.Group style={{marginTop:"2vw"}}>
                       <label htmlFor="username">Enter Username</label>
                       <Form.Control type="text" name="username" ref={usernameref} onFocus={focusEvent}></Form.Control>
                   </Form.Group>
                </Form>
               <Button style={{marginTop:"2vw"}} onClick={changeUserName}>Change Username</Button>
            </Container> : <Warning color="#56d696" text="Successfully changed the Username"/>
        );
    }
    else if(changeOption==="account")
    {
        return(
            !deletedAccount ? 
            <Container>
                <Form>
                    <h3>Profile Settings</h3>
                    <Form.Group style={{marginTop:"2vw",marginBottom:"2vw"}}>
                   <label htmlFor="password">Enter Password</label>
                   <Form.Control ref={oldpasswordref} type="password" name="password" onFocus={focusEvent}></Form.Control>
                   </Form.Group>
                   <Button variant="danger" onClick={deleteAccount} style={{marginTop:"2vw"}}>Delete Account</Button>
                </Form>
                {
              error.length!=0 && <h3 style={{backgroundColor:"#f2888b",padding:"0.2vw",borderRadius:"4px",marginTop:"4vw",padding:'1vw'}}>{error}</h3>
            }               
           </Container> : <Warning text="Successfully Deleted the Account" color="#56d696"/>
        )
    }
    else if(changeOption==="forgotPassword")
    {
        return(
            !passwordlink ? 
            (<Container>
                <Form>
                    <h3>Profile Settings</h3>
                    <Form.Group style={{marginTop:"2vw",marginBottom:"2vw"}}>
                        <label htmlFor="email">Email Address</label>
                        <Form.Control ref={emailAddressRef} type="email" name="email" onFocus={focusEvent}></Form.Control>
                        <Button onClick={recoverPassword} style={{marginTop:"2vw"}}>Send Reset Password Link</Button>
                    </Form.Group>
                </Form>
                {
                  error.length!=0 && <h3 style={{backgroundColor:"#f2888b",padding:"0.2vw",borderRadius:"4px",marginTop:"4vw",padding:'1vw'}}>{error}</h3>
               }
            </Container>) : <Warning text="Successfully sent the Password Reset Link" color="#56d696"/>
        )
    }
}