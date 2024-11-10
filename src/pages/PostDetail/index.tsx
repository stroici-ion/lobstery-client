import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Post from '../../components/Post';
import { IPost } from '../../models/posts/IPost';
import { fetchPostDetail } from '../../services/posts/PostServices';

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
