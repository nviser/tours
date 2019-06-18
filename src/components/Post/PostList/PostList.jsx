import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import PostComponent from '../PostComponent/PostComponent';

const mapStateToProps = state => ({
  posts: state.posts,
});

const PostList = props =>
  props.posts.map(post => (
    <PostComponent
      key={post.id}
      userPost={post}
      isItRoutes={props.isItRoutes}
      userPage={props.userPage}
    />
  ));

PostList.defaultProps = {
  posts: null,
};
PostList.propTypes = {
  posts: PropTypes.instanceOf(Object),
};

export default connect(mapStateToProps)(PostList);
