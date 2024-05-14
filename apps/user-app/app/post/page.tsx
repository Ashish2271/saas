import React, { useEffect, useState } from 'react';
import prisma from '../lib/prismaClient';
import { GetServerSidePropsContext } from 'next';
import { useSession } from 'next-auth/client';

interface Props {
  post: {
    id: number;
    title: string;
    link: string | null;
    linkType: string;
    description: string | null;
    thumbnail: string | null;
    hidden: boolean;
    createdAt: Date;
    author: {
      id: string;
      name: string | null;
      image: string | null;
    };
    bookmark: {
      id: number;
      userId: string;
      postId: number;
      createdAt: Date;
    } | null;
    type: string;
    upvotes: number;
    downvotes: number;
    comments: Array<{
      id: number;
      postId: number;
      userId: string;
      text: string;
      createdAt: Date;
      replies: Array<{
        id: number;
        postId: number;
        userId: string;
        text: string;
        createdAt: Date;
      }>;
    }>;
  };
}

const PostPage: React.FC<Props> = ({ post }) => {
  const [session, loading] = useSession();
  const [showComments, setShowComments] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState(post.comments || []);
  const [bookmarked, setBookmarked] = useState(!!post.bookmark);

  useEffect(() => {
    if (post.comments) {
      setComments(post.comments);
    }
  }, [post.comments]);

  const handleAddComment = async () => {
    if (!session?.user) return;

    try {
      await fetch('/api/comments', {
        method: 'POST',
        body: JSON.stringify({
          postId: post.id,
          text: newComment,
          userId: session.user.id,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setNewComment('');
      setComments((prev) => [...prev, post.comments[0]]);
    } catch (error) {
      console.log(error);
    }
  };

  const handleToggleComments = () => {
    setShowComments(!showComments);
  };

  const handleBookmarkClick = async () => {
    if (!session?.user) return;

    try {
      if (bookmarked) {
        await fetch(`/api/bookmarks/${post.bookmark?.id}`, {
          method: 'DELETE',
        });
      } else {
        await fetch('/api/bookmarks', {
          method: 'POST',
          body: JSON.stringify({
            postId: post.id,
            userId: session.user.id,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }

      setBookmarked(!bookmarked);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-4">
      <h1>{post.title}</h1>
      {post.link && (
        <a href={post.link}>
          <img src={post.thumbnail ?? '/placeholder.jpg'} alt="" />
        </a>
      )}
      <p>{post.description}</p>
      <button onClick={handleToggleComments}>
        Show {showComments ? 'Less' : 'More'} Comments
      </button>
      {showComments && (
        <ul>
          {comments.map((comment) => (
            <li key={comment.id}>
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 mr-3 rounded-full overflow-hidden bg-gray-50">
                  <img
                    src={comment.User.image ?? '/placeholder.jpg'}
                    alt=""
                    className="object-cover w-full h-full"
                  />
                </div>
                <span className="font-bold">{comment.User.name}</span>
              </div>
              <p>{comment.text}</p>
              <time dateTime={comment.createdAt.toISOString()}>
                {new Date(comment.createdAt).toLocaleDateString()}
              </time>
              {/* Add code here to show any nested replies */}
            </li>
          ))}
        </ul>
      )}
      <div className="mt-4 flex items-center space-x-4">
        <button onClick={handleBookmarkClick}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#fff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`h-6 w-6 ${bookmarked ? 'fill-red-500' : ''}`}
          >
            <path d="M19.5 4.5l-15 15"></path>
          </svg>
        </button>
        <input
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Leave a comment..."
          className="flex-1 border p-2 focus:outline-none"
        />
        <button
          disabled={!newComment}
          onClick={handleAddComment}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default PostPage;

// Server-side props function to get data from database based on the post ID passed in via query params
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const postId = context.query.id;

  if (!postId) {
    return { notFound: true };
  }

  let post;

  try {
    post = await prisma.post.findUnique({
      where: { id: Number(postId) },
      include: {
        author: true,
        bookmark: true,
        comments: {
          include: {
            user: true,
            replies: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });
  } catch (error) {
    console.log(error);
    return { notFound: true };
  }

  if (!post) {
    return { notFound: true };
  }

  return {
    props: {
      post,
    },
  };
}