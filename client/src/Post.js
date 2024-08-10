import {format} from "date-fns";
import {Link} from "react-router-dom";

export default function Post({_id, title, originalWriter, cover, content, createdAt, author}) {
    
  return (
    <Link to={`/post/${_id}`} className="post-link">
      <div className="post">
        <div className="image">
          <img src={'http://localhost:4000/' + cover} alt=""></img>
        </div>
        <div className="texts">
          <h4>{title}</h4>
          <p>Composed by {originalWriter}</p>
          {/* <p>
            <span className="author">created by {author.username} on </span>
            <time>{format(new Date(createdAt), 'MMM d, yyyy HH:mm')}</time>
          </p> */}
        </div>
        {/* <div className="cta">
          <h5>See more</h5>
        </div> */}
      </div>
    </Link>
  );
}