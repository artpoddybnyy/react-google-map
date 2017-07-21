import React, { Component } from 'react';
import '../App.css';
import PostsComponent from './PostsComponent';
import $ from 'jquery';

export default class PostsService extends Component {

    constructor() {
        super();
        this.state = {posts: []}
    }

    getPosts() {
        $.ajax({
            url: 'https://jsonplaceholder.typicode.com/posts',
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({posts: data});
            }.bind(this),
            error: function (xhr, status, err) {
                console.log(err);
            }
        });
    }

    componentWillMount() {
        this.getPosts();
    }

    componentDidMount() {
        this.getPosts();
    }

    render() {
        return (
            <div>
                <PostsComponent posts={this.state.posts}/>
            </div>
        );
    }
}