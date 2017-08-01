import React, { Component } from 'react';
import PostItem from "./PostItem";
import PropTypes from 'prop-types';


export default class PostsComponent extends Component {

    render() {
        let postItems = this.props.posts.map(post =>
            <PostItem key={post.id} post={post} del={this.props.del} open={this.props.open} />);

        return (
            <div>
                <div className="post-header">
                    <h1 >Posts List</h1>
                </div>
                {postItems}
            </div>
        );
    }
}

PostsComponent.propTypes = {
   posts: PropTypes.array
};
