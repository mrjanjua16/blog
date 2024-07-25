import { Link } from 'react-router-dom';

export default function PostCard({ post }) {
  return (
    <div className='group relative w-full border border-teal-500 hover:border-2 h-[350px] overflow-hidden rounded-lg sm:w-[380px] transition-all'>
      <Link to={`/post/${post.SLUG}`}>
        <img
          src={post.IMAGE}
          alt='post cover'
          className='h-[220px] w-full object-cover group-hover:h-[180px] transition-all duration-300 z-20'
        />
      </Link>
      <div className='p-2 flex flex-col gap-1'>
        <p className='text-md font-semibold line-clamp-2'>{post.TITLE}</p>
        <span className='italic text-xs'>{post.CATEGORY}</span>
        <Link
          to={`/post/${post.SLUG}`}
          className='z-10 group-hover:bottom-0 absolute bottom-[-150px] left-0 right-0 border border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white transition-all duration-300 text-center py-1.5 rounded-md !rounded-tl-none m-1.5'
        >
          Read article
        </Link>
      </div>
    </div>
  );
}
