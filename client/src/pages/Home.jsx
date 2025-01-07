import { Link } from 'react-router-dom';
import CallToAction from '../components/CallToAction';
import PostCard from '../components/PostCard';
import { useQuery } from '@tanstack/react-query';

export default function Home() {
  const fetchBlogs = async () => {
    const res = await fetch('/api/post/get-posts');
    const data = await res.json();
    return data.posts;
  };

  const { data: posts, isLoading, isError } = useQuery({
    queryKey: ['blogs'],
    queryFn: fetchBlogs,
  });

  if (isLoading) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  if (isError) {
    return <p className="text-center text-red-500">Something went wrong while fetching posts.</p>;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-6xl font-extrabold text-gray-800">
            Welcome to <span className="text-teal-500">THE BLOG</span>
          </h1>
          <p className="mt-4 text-gray-600 text-lg">
            Discover articles and tutorials on topics like Development, Investing, and Blockchain.
          </p>
          <Link
            to="/search"
            className="mt-4 inline-block text-teal-600 hover:underline text-lg font-medium"
          >
            View all posts
          </Link>
        </div>

        {/* Call to Action */}
        <div className="bg-teal-50 p-6 rounded-lg shadow-md mb-12">
          <CallToAction />
        </div>

        {/* Recent Posts */}
        <div>
          <h2 className="text-3xl font-semibold text-center text-gray-800 mb-8">
            Recent Posts
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <div
                key={post._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <PostCard post={post} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Link */}
      <div className="text-center py-10">
        <Link
          to="/search"
          className="text-teal-600 hover:underline text-xl font-semibold"
        >
          View all posts
        </Link>
      </div>
    </div>
  );
}
