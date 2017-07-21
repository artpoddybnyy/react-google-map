import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class PostItem extends Component {

    render() {
        return (
            <div className="container-post">
                <input id="checkbox" type="checkbox" className="item-post checkbox"/>
                <div className="item-post">{this.props.post.id}</div>
                <div className="item-post title">{this.props.post.title}</div>
                <div className="item-post body">{this.props.post.body}</div>
            </div>
        );
    }
}

PostItem.propTypes = {
    post: PropTypes.object
};

