import { useState } from "react";
import 'react-quill/dist/quill.snow.css';
import { Navigate } from "react-router-dom";
import Editor from "../Editor";

export default function CreatePostPage() {
    const [title, setTitle] = useState('');
    const [originalWriter, setOriginalWriter] = useState('');
    const [content, setContent] = useState('');
    const [postImages, setPostImages] = useState('');
    const [redirectToHomePage, setRedirectToHomePage] = useState(false);

    async function createNewPost(ev) {
        ev.preventDefault();
        console.log("Creating new post");

        const data = new FormData();
        data.set('title', title);
        data.set('originalWriter', originalWriter);
        data.set('content', content);
        if(postImages) {
            data.set('postImage', postImages[0]);
        }

        console.log("Sending request with data", data);

        const response = await fetch('http://localhost:4000/post', {
            method: 'POST',
            body: data,
            credentials: 'include',
        });

        console.log("Response from server", await response.json());

        // Redirect to the home page after creating a post
        if(response.ok) {
            setRedirectToHomePage(true);
        }
    }

    if(redirectToHomePage) {
        return <Navigate to={'/'} />
    }
    return(
        <form className="create-post" onSubmit={createNewPost}>
            <h1>Create New Post</h1>
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
            <Editor value={content} onChange={setContent} />
            <button style={{marginTop: '7px'}}>Create Post</button>
        </form>
    );
}