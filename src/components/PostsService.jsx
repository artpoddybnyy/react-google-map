import React, {Component} from 'react';
import '../App.css';
import PostsComponent from './PostsComponent';
import $ from 'jquery';
import Modal from 'react-modal';

export default class PostsService extends Component {

    constructor() {
        super();
        this.state = {
            id: null,
            posts: [],
            onePost: {
                title: null,
                body: null
            },
            modalIsOpen: false
        };
    }

    getPosts() {
        $.get({
            url: 'https://jsonplaceholder.typicode.com/posts',
            dataType: 'json',
            cache: false,
            success:  (data) => this.setState({posts: data.splice(0, 5)}),
            error:  (xhr, status, err) => console.log(err)
        });
    }


    addPost(event) {
        this.setState({
                onePost: {
                    title: this.refs.title.value,
                    body: this.refs.body.value
                }
            }, () => $.post({
                    url: 'https://jsonplaceholder.typicode.com/posts',
                    dataType: 'json',
                    data: this.state.onePost
                }).then((status, success, response) => console.log(response),
                    (error) => console.log(error))
        );
        this.refs.title.value = null;
        this.refs.body.value = null;
        event.preventDefault();
    }

    deletePost(id) {
        $.ajax({
            type: 'DELETE',
            url: 'https://jsonplaceholder.typicode.com/posts/' + id
        }).then((status, success, response) => console.log(response));
    }

    updatePost(event) {
        this.setState({
            onePost: {
                title: this.refs.titlemodal.value,
                body: this.refs.bodymodal.value
            }, modalIsOpen: false,
        }, ()=> $.ajax('https://jsonplaceholder.typicode.com/posts/' + this.state.id,
            {
                type: 'PATCH',
                data: this.state.onePost
            }).then((status, success, response) => console.log(response))
        );
        event.preventDefault();
    }

    openModal(id, title, body) {
        this.setState({
            modalIsOpen: true, id: id,
            onePost: {
                title: title, body: body
            }
        });
    }

    closeModal() {
        this.setState({modalIsOpen: false});
    }

    componentWillMount() {
        this.getPosts();
    }

    componentDidMount() {
    }

    render() {
        return (
            <div>
                <form className="post-form">
                    <label >Title</label>
                    <input className="in" type="text" ref="title" name="title"/>
                    <label >Body</label>
                    <textarea className="in t-area" type="text" ref="body" name="body"/>
                    <button className="btn" onClick={this.addPost.bind(this)}>Add post</button>
                </form>
                <PostsComponent open={this.openModal.bind(this)} del={this.deletePost} posts={this.state.posts}/>
                <Modal
                    isOpen={this.state.modalIsOpen}
                    contentLabel="Example Modal"
                    className="modal-window">
                    <form className="post-form">
                        <label >Title</label>
                        <input className="in" defaultValue={this.state.onePost.title}
                               type="text" ref="titlemodal"/>
                        <label>Body</label>
                        <textarea className="in t-area" defaultValue={this.state.onePost.body}
                                  type="text" ref="bodymodal" name="body"/>
                        <button className="btn" onClick={this.updatePost.bind(this)}>update post</button>
                        <button className="btn" onClick={this.closeModal.bind(this)}>close</button>
                    </form>
                </Modal>
            </div>
        );
    }
}