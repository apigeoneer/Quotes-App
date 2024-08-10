import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import Editor from "../Editor";

// const formats = [
//     'header',
//     'bold', 'italic', 'underline', 'strike', 'blockquote',
//     'list', 'bullet', 'indent',
//     'link', 'image'
// ]

export default function EditPostPage() {
    const {id} = useParams();
    const [title, setTitle] = useState('');
    const [originalWriter, setOriginalWriter] = useState('');
    const [content, setContent] = useState('');
    const [postImages, setPostImages] = useState('');
    // const [cover, setCover] = useState('');
    const [redirectToPostPage, setRedirectToPostPage] = useState(false);

    useEffect(() => {
        fetch('http://localhost:4000/post/'+id)
        .then(response => { response.json()
            .then(postInfo => {
                setTitle(postInfo.title);
                setContent(postInfo.content);
                setOriginalWriter(postInfo.originalWriter);
            });
        });
    }, []);

    async function updatePost(ev) {
        ev.preventDefault();
        const data = new FormData();
        data.set('title', title);
        data.set('originalWriter', originalWriter);
        data.set('content', content);
        data.set('id', id);
        if(postImages?.[0]) {
            data.set('postImage', postImages?.[0]);
        }

        console.log('Updating post with data:', Object.fromEntries(data));

        try {
            console.log('Sending request to update post');
            const response = await fetch('http://localhost:4000/post', {
                method: 'PUT',
                body: data,
                credentials: 'include',
            });
    
            console.log('Received response:', response);
    
            // Redirect to the home page after creating a post
            if(response.ok) {
                const responseData = await response.json();
                console.log('Response data:', responseData);
                setRedirectToPostPage(true);
            } else {
                console.log("Failed to update the post. Status:", response.status);
                const errorText = await response.text();
                console.log("Error details:", errorText);
            } 
        } catch(error) {
            console.error("Error updating post:", error);
            if (error instanceof TypeError && error.message === "Failed to fetch") {
              console.log("This might indicate a network error or that the server is not responding.");
            }
        }
    }

    if(redirectToPostPage) {
        return <Navigate to={'/post/' + id} />
    }
    
    return(
        <form className="edit-post" onSubmit={updatePost}>
            <h1>Edit Post</h1>
            <input type="title"
                placeholder={'Title'} 
                value={title} 
                onChange={ev => setTitle(ev.target.value)}/>
            <input type="originalWriter" 
                placeholder={'Original Writer'} 
                value={originalWriter} 
                onChange={ev => setOriginalWriter(ev.target.value)}/>
            <input type="file"  
                // value={files}
                onChange={ev => setPostImages(ev.target.files)}/>
            <Editor onChange={setContent} value={content}/>
            <button style={{marginTop: '7px'}}>Update Post</button>
        </form>
    );
}