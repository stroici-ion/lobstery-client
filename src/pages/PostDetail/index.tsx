import React, { Suspense, useEffect, useState } from 'react';
import { Await, useParams, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectPostById } from '../../redux/posts/selectors';
import Post from '../../components/Post';
import { IPost } from '../../models/IPost';
import { fetchPostDetail } from '../../services/PostServices';

const PostDetail: React.FC = () => {
  const { id } = useParams();
  const [post, setPost] = useState<IPost>();

  useEffect(() => {
    if (!id) return;
    fetchPostDetail(parseInt(id)).then((data) => setPost(data));
  }, []);

  return <div>{post && <Post post={{ ...post, viewsCount: 10 }} />}</div>;
};

export default PostDetail;
