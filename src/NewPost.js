import {addDocstoPost} from './Data';
import {Button,Card} from 'react-bootstrap';
import {useRef,useState} from 'react';
import {FcGallery} from 'react-icons/fc';
import {upLoadImg} from './Data';
export default function NewPost({getDocs,useremail,movieId})
{
    const [imgfile,setImgFile] = useState(null);
    const commentRef = useRef();
    const imageRef = useRef();
    const imageChangeHandler=(e)=>
    {
        const file = e.target.files[0];
        setImgFile(file);
        const reader = new FileReader();
        const URL = reader.readAsDataURL(file);
        reader.onloadend=()=>
        {
            imageRef.current.src = reader.result;
        }
    }    
    const postsubmitHandler=async (e)=>
    {
        const comment = commentRef.current.value;
        if(comment.split(" ").join("")==''){alert("Empty Post!");commentRef.current.value='';return;}
        const imgId = 'images/'+String(Date.now());
        const post = {title:comment,email:useremail,likes:"0",movieId:movieId,imgRef:imgId};
        await addDocstoPost(post);
        if(imgfile){await upLoadImg(imgfile,imgId);}
        await getDocs();
        commentRef.current.value='';
        setImgFile(null);
    }
    return (
        <Card style={{padding:"1vw",width:"40vw",marginTop:"2vw",marginLeft:"30%"}}>
        <p>{useremail}</p>
        {imgfile && <Card.Img variant='top' ref={imageRef} width="20%"></Card.Img>}
        <Card.Body>
            <textarea ref={commentRef} style={{width:"100%"}} placeholder="Comment here."></textarea>
        </Card.Body>
        <div style={{display:"flex",justifyContent:"space-around",alignItems:"center"}}>
            <div>
                <label>
                  <FcGallery className='enlarge-icons'/> 
                  <input type="file" style={{display:"none"}} onChange={imageChangeHandler} accept="image/png, image/gif, image/jpeg"></input> 
                </label>
            </div>
            <div><Button onClick={postsubmitHandler}>Create Post</Button></div>
        </div>
        </Card>
    )
}