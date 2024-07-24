import { Link, useParams } from 'react-router-dom';
import { Button, Spinner } from 'flowbite-react';
import { useEffect, useState } from 'react';
import CallToAction from '../components/CallToAction.jsx';
import CommentsSection from '../components/CommentsSection.jsx';
import PostCard from '../components/PostCard.jsx';

export default function PostPage() {
  const { postSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState([]);
  
  useEffect(
    () => {
      const fetchPost = async () => {
        try {
          setLoading(true);
          const post = await fetch(`/api/post/get-posts?slug=${postSlug}`);
          const data = await post.json();
          if (!post.ok){
            setError(true);
            setLoading(false);
            return;
          }
          if (post.ok) {
            setPost(data.posts[0]);
            setLoading(false);
            setError(false);
          }
        } catch (error) {
          setError(true);
          setLoading(false);
        }
      }
      fetchPost();
    },
    [postSlug]
  );

  useEffect(
    () => {
      try {
        const fetchRecentPosts = async () => {
          const post = await fetch(`/api/post/get-posts?limit=3`);
          const data = await post.json();
          if(post.ok) {
            setRecentPosts(data.posts);
          }
        };
        fetchRecentPosts();
      } catch (error) {
        console.log(error.message);
      }
    },
    []
  );
  
  if (loading) 
    return (
      <div className='flex justify-center items-center h-screen'>
        <Spinner
          color='gray'
          size='xl'
        />
      </div>
    );

  return (
    <main className='p-3 flex flex-col max-w-6xl mx-auto min-h-screen'>
      <h1 className='text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl'>
        {post && post.TITLE}
      </h1>
      <Link
       to={`/search?category=${post && post.CATEGORY}`}
       className='self-center mt-5'
      >
        <Button color='gray' pill size='xs'>
          {post && post.CATEGORY}
        </Button>
      </Link>
      <img 
       src={post && post.IMAGE}
       alt={post && post.TITLE}
       className='mt-10 p-3 max-h-[600px] w-full object-cover'
      />
      <div className='flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs'>
        <span>Posted at {post && new Date(post.createdAt).toLocaleDateString()}</span>
        <span>{post && (post.CONTENT.length / 1000).toFixed(0)} min read
        </span>
      </div>
      <div
        className='p-3 max-w-2xl mx-auto w-full post-content'
        dangerouslySetInnerHTML={{ __html: post && post.CONTENT }}
      />
      <div className='max-w-4xl mx-auto w-full'>
        <CallToAction category={post && post.CATEGORY} />
      </div>
      <CommentsSection postId={post._id} />

      <div className='flex flex-col justify-center items-center mb-5'>
        <h1 className='text-xl mt-5'>Recent articles</h1>
        <div className='flex flex-wrap gap-5 mt-5 justify-center'>
          {recentPosts && 
            recentPosts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))
          }
        </div>
      </div>
    </main>
  )
}
