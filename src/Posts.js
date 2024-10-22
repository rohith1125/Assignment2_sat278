import {useState,useEffect} from 'react';
import {fetchPosts,deletepost, deleteImg} from './Data';
import Post from './Post';
import NewPost from './NewPost'
export default function Posts({movieId,userid,useremail}) 
{
    const [posts,setPosts] = useState([]);
    const getDocs =async ()=>
    {
        const Posts=[];
        const data = await fetchPosts(movieId);
        data.forEach((doc)=>
        {
            Posts.push({id:doc.id,...doc.data()});
        });
        setPosts(Posts);
    }
    useEffect(async ()=>
    {
        await getDocs();
    },[]);
    const deleteHandler=(id,imgRef)=>
    {
          return async (e)=>
          {
              e.preventDefault();
              setPosts(posts.filter(post => post.id!=id));
              deletepost(id);
              deleteImg(imgRef);
          };
    }
    return (
        <>
        <NewPost getDocs={getDocs} useremail={useremail} movieId={movieId}/> 
        { posts.length ==0 ? 
        <div style={{margin:"4vw",width:"90vw",display:"flex",justifyContent:"center",alignItems:"center",borderRadius:"4px",marginTop:"4vh",marginLeft:"10vh",padding:"4vw"}}>
           <h1>No Posts Yet!</h1>
        </div>
        :
        <div style={{margin:"4vw",width:"90vw",borderRadius:"4px",marginTop:"4vh",marginLeft:"10vh",padding:"4vw"}} className='posts-grid'>
        {
            posts.map((post)=>
            <Post key={post.id} id={post.id} email={post.email}
            userid={userid} likes={post.likes} imgRef={post.imgRef} deleteHandler={deleteHandler} post_userid={post.userid} posts={posts} setPosts={setPosts}
            title={post.title}/>)
        }
       </div>
       }
       </>
    )
}