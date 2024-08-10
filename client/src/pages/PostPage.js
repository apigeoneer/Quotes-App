import {useContext, useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import {formatDistanceToNow, parseISO} from "date-fns";
import {UserContext} from "../UserContext";
import {Navigate} from "react-router-dom";


export default function PostPage() {
    const {id} = useParams();
    const [postInfo, setPostInfo] = useState(null);
    const {userInfo} = useContext(UserContext);

    useEffect(() => {
        fetchPost();
    }, []);

    function fetchPost() {
        fetch(`http://localhost:4000/post/${id}`)
            .then(response => {
                if(!response.ok) {
                    throw new Error("Network response was not ok.");
                }
                return response.json();
            })
            .then((postInfo) => {
                setPostInfo(postInfo);
            })
            .catch((error) => {
                console.log("There was a problem with the fetch operation", error);
            });
    }

    async function deletePost() {
        const response = await fetch(`http://localhost:4000/post/${id}`, {
            method: 'DELETE',
            credentials: 'include',
        });

        if (response.ok) {
            console.log("Deleted post succesfully.")
        } else {
            alert('Error deleting post');
        }
    }

    if(!postInfo) return 'No post info';

    return(
        <div className="post-page">
            <h1>{postInfo.title}</h1>
            <div className="post-page-details">
                <div>Originally composed by {postInfo.originalWriter} </div>
                <div>Published by {postInfo.author.username} 
                    <time> {formatDistanceToNow(parseISO(postInfo.createdAt))} ago</time>
                </div>
                {userInfo && userInfo.id === postInfo.author._id && (
                    <div className="post-actions">
                        <Link className="edit-link" to={`/edit/${postInfo._id}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                            </svg>
                            Edit Post
                        </Link>
                        <Link className="delete-link" onClick={deletePost} to={`/`}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
                            Delete Post
                        </Link>
                    </div>
                )}
            </div>
            {postInfo.cover && (
                <div className="post-image">
                    <img src={`http://localhost:4000/${postInfo.cover}`} alt="" />
                </div> 
            )}
            <div dangerouslySetInnerHTML={{__html: postInfo.content}} /> 

            {/* <footer>
                <div>
                    Made with &#x2764;&#xfe0f; by Chitranshi Srivastava.
                </div>
                <div>
                    Clone <a href='/'>this Github repo</a> to create your own blog.
                </div>
            </footer>         */}
        </div>
    );
}