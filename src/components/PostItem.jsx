import React, {Component} from 'react';
import PropTypes from 'prop-types';

export default class PostItem extends Component {

    render() {
        return (
            <div className="container-post">
                {/*<input id="checkbox" type="checkbox" className="item-post checkbox"/>*/}
                <div className="item-post title">{this.props.post.title}</div>
                <div className="item-post body">{this.props.post.body}</div>
                <button onClick={()=> this.props.del(this.props.post.id)} className="btn">delete</button>
                <button onClick={()=>this.props.open(this.props.post.id, this.props.post.title, this.props.post.body )} className="btn">update</button>
            </div>
        );
    }
}

PostItem.propTypes = {
    post: PropTypes.object
};

