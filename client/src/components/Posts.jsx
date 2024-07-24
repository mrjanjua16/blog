import { Modal, Table, Button } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";

import { useSelector } from "react-redux"
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Posts() {
  const { currentUser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState('');
  
  useEffect(
    () => {
      const fetchUserPosts = async () => {
        try {
          const posts = await fetch(`/api/post/get-posts?userId=${currentUser._id}`);
          const data = await posts.json();
          if (posts.ok) {
            setUserPosts(data.posts);
            if (data.posts.length < 9) {
              setShowMore(false);
            }
          }
        } catch (error) {
          console.log(error);
        }
      };
      if (currentUser.isAdmin) {
        fetchUserPosts();
      }
    },
    [currentUser._id]
  );

  const handleShowMore = async () => {
    const startIndex = userPosts.length;
    try {
      const res = await fetch(`/api/post/get-posts?userId=${currentUser._id}&startIndex=${startIndex}`);
      const data = await res.json();
      if (res.ok) {
        setUserPosts((prev) => [...prev, ...data.posts]);
        if (data.posts.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };


  const handleDeletePost = async () => {
    setShowModal(false);
    try {
      const res = await fetch(`/api/post/delete-post/${postIdToDelete}/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        setUserPosts((prev) => prev.filter((post) => post._id !== postIdToDelete));
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {currentUser.isAdmin && userPosts.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date Updated</Table.HeadCell>
              <Table.HeadCell>Post Image</Table.HeadCell>
              <Table.HeadCell>Post Title</Table.HeadCell>
              <Table.HeadCell>Author</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>
                <span>Edit</span>
              </Table.HeadCell>
            </Table.Head>
            {userPosts.map(
              (post) => (
                <Table.Body className="divide-y">
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell>
                      {new Date(post.updatedAt).toLocaleDateString()}
                    </Table.Cell>
                    <Table.Cell>
                      <Link
                         to={`/post/${post.SLUG}`}>
                        <img
                          src={post.IMAGE}
                          alt={post.TITLE}
                          className="w-20 h-10 object-cover bg-gray-500"
                        />
                      </Link>
                    </Table.Cell>
                    <Table.Cell>
                      <Link
                        to={`/post/${post.SLUG}`}
                        className="font-medium text-gray-900 dark:text-white"
                      >
                        {post.TITLE}
                      </Link>
                    </Table.Cell>
                    <Table.Cell>
                      <Link
                        to={`/post/${post.SLUG}`}
                        className="font-medium text-gray-900 dark:text-white"
                      >
                        {post.AUTHOR.email}
                      </Link>
                    </Table.Cell>
                    <Table.Cell>
                      <Link
                        to={`/post/${post.SLUG}`}
                        className="font-medium text-gray-900 dark:text-white"
                      >
                        {post.CATEGORY}
                      </Link>
                    </Table.Cell>
                    <Table.Cell>
                      <span
                        onClick={() => {
                          setShowModal(true);
                          setPostIdToDelete(post._id);
                        }}
                        className='font-medium text-red-500 hover:underline cursor-pointer'
                      >
                        Delete
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      <Link
                        to={`/Update-Post/${post._id}`}
                        className="text-teal-500 hover:underline"
                      >
                        <span>Edit</span>
                      </Link>
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              )
            )}
          </Table>
          {showMore && (
            <button
              onClick={handleShowMore}
              className="w-full text-teal-500 self-center text-sm py-7"
            >
              Show More
            </button>
          )}
        </>
      ) : (
        <p>You have no posts yet!</p>
      )}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size='md'
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="text-red-500 w-16 h-16" />
            <h3 className="text-lg font-medium text-gray-900">
              Are you sure you want to delete this post?
            </h3>
            <div className="">
              <Button color="failure" onClick={handleDeletePost}>
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
