import Post from "../Post";
import {useEffect, useState} from "react";
// import Masonry from 'masonry-layout';


export default function IndexPage() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        fetch('http://localhost:4000/posts')
            .then(response => {
                response.json().then(posts => {
                    // console.log(posts);
                    setPosts(posts);
            });
        });
    }, []);

    // useEffect(() => {
    //     const grid = document.querySelector('.posts-container');
    //     if(grid) {
    //         new Masonry(grid, {
    //             itemSelector: '.post',
    //             columnWidth: '.post',
    //             gutter: 20,
    //             percentPosition: true
    //         });
    //     }
    // }, [posts]);

    return (
        <>
            {/* <h1>All Contests</h1> */}
            <div className="posts-container">
                {posts.length > 0 && posts.map(post => (
                    <Post key={post._id} {...post}/>
                ))}
            </div>
            {/* <footer>
                <div>
                    Made with &#x2764;&#xfe0f; by Chitranshi Srivastava.
                </div>
                <div>
                    Clone <a href='/'>this Github repo</a> to create your own blog.
                </div>
            </footer> */}
        </>
    );
}