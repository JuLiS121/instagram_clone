import { useEffect, useRef, useState } from 'react';
import { supabase } from './../../config/supabase';
import { ImageObject } from './Profile';
import {
  addLike,
  addSave,
  deleteLike,
  deleteSave,
  getFollowing,
} from '@/config/api';
import { Post } from '@/components/shared/PostDetails';
import { Avatar } from '@radix-ui/react-avatar';
import { useNavigate } from 'react-router-dom';

const Reels = ({
  handleOpenComments,
  username,
  likesCount,
  setLikesCount,
  likedPosts,
  setLikedPosts,
  savedPosts,
  setSavedPosts,
}: {
  likesCount: { [postId: string]: number };
  setLikesCount: (arg0: { [postId: string]: number }) => void;
  likedPosts: string[];
  setLikedPosts: (arg0: string[]) => void;
  savedPosts: string[];
  setSavedPosts: (arg0: string[]) => void;
  openComments: boolean;
  handleOpenComments: (arg0: ImageObject) => void;
  username: string;
}) => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [following, setFollowing] = useState<string[] | undefined>([]);

  const followingRef = useRef<string[] | undefined>();
  followingRef.current = following;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data: postsData, error } = await supabase
          .from('posts')
          .select('creator,post_id,imageUrl,caption,created_at');

        if (error) {
          throw error;
        }

        if (postsData && postsData.length > 0) {
          // Fetch profile images for each creator
          const postsWithProfileImages: Post[] = await Promise.all(
            postsData
              .filter(
                (post) =>
                  post.imageUrl.slice(-3) === 'mp4' ||
                  post.imageUrl.slice(-3) === 'mp3'
              )
              .map(async (post) => {
                const { data: userData, error: userError } = await supabase
                  .from('users')
                  .select('profileImg') // Adjust field name according to your Supabase schema
                  .eq('username', post.creator)
                  .single();
                const follow = await getFollowing(username);
                setFollowing(follow?.map((follow) => follow.followed));
                if (userError) {
                  throw userError;
                }

                const profileImage = userData?.profileImg || ''; // Default to empty string if no profile image found

                return { ...post, profileImage };
              })
          );

          setPosts(
            postsWithProfileImages.filter((postProfile) =>
              followingRef.current?.includes(postProfile.creator)
            )
          );
          // Fetch and set likes count for each post
          const likes: Record<string, number> = {};
          for (const post of postsData) {
            const { data: likesData, error: likeError } = await supabase
              .from('likes')
              .select('post_id')
              .eq('post_id', post.post_id);
            if (likeError) {
              throw likeError;
            }
            likes[post.post_id] = likesData.length;
          }
          setLikesCount(likes);
          // Fetch liked posts for the current user
          const { data: likedPostsData, error: likedPostsError } =
            await supabase
              .from('likes')
              .select('post_id')
              .eq('username', username);
          if (likedPostsError) {
            throw likedPostsError;
          }
          if (likedPostsData) {
            const likedPostIds = likedPostsData.map((item) => item.post_id);
            setLikedPosts(likedPostIds);
          }
          const { data: savedPostsData, error: savedPostsError } =
            await supabase
              .from('saved')
              .select('post_id')
              .eq('username', username);
          if (savedPostsError) throw savedPostsError;
          if (savedPostsData) {
            const savedPostIds = savedPostsData.map((item) => item.post_id);
            setSavedPosts(savedPostIds);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchPosts();
  }, [setLikedPosts, setLikesCount, setSavedPosts, username, followingRef]);

  const handleLike = async (id: string) => {
    try {
      if (likedPosts.includes(id)) {
        await deleteLike(id, username);
        setLikedPosts(likedPosts.filter((postId) => postId !== id));
        setLikesCount({ ...likesCount, [id]: likesCount[id] - 1 });
      } else {
        await addLike(id, username);
        setLikedPosts([...likedPosts, id]);
        setLikesCount({ ...likesCount, [id]: likesCount[id] + 1 });
      }
    } catch (error) {
      console.error('Error handling like:', error);
    }
  };

  const handleSave = async (id: string) => {
    if (savedPosts.includes(id)) {
      await deleteSave(id, username);
      setSavedPosts(savedPosts.filter((postId) => postId !== id));
    } else {
      await addSave(id, username);
      setSavedPosts([...savedPosts, id]);
    }
  };
  return (
    <div className='w-full lg:w-[85%] lg:mx-auto lg:my-12 h-screen lg:full'>
      <span className='fixed lg:static lg:w-full lg:mb-6 font-bold lg:mb-6 z-40 pt-4 pl-4 text-2xl text-white lg:pt-0 md:pl-20 lg:pl-4 lg:text-base lg:text-black'>
        Reels
      </span>
      <span className='w-full opacity-0 absolute lg:opacity-100 lg:static'>
        <hr />
      </span>
      <div className='w-full h-full'>
        {posts.map((post) => {
          return (
            <div
              key={post.post_id}
              className='relative  lg:top-8 lg:bottom-10 lg:mb-8 lg:w-[50%] lg:h-[85%] hover:opacity-90 cursor-pointer flex lg:gap-4 items-center w-full h-full lg:mx-auto'
            >
              <video
                className='absolute top-0 right-0 left-0 bottom-0 w-full lg:w-[80%] h-full object-cover'
                controls
              >
                <source
                  src={post.imageUrl}
                  type={`video/${post.imageUrl.slice(-3)}`}
                />
              </video>
              <div className='flex flex-col justify-between items-center pt-60 absolute right-7 bottom-20 lg:right-1 lg:bottom-0'>
                <img
                  onClick={() => {
                    handleLike(post.post_id);
                  }}
                  src={
                    likedPosts.includes(post.post_id)
                      ? '/insta-pics/heart.png'
                      : '/insta-pics/notifications.png'
                  }
                  alt='like'
                  className={`w-8 cursor-pointer ${
                    !likedPosts.includes(post.post_id) && 'hover:opacity-50'
                  }`}
                />
                <span className='mb-5'>{likesCount[post.post_id] ?? 0}</span>
                <img
                  onClick={() => handleOpenComments(post)}
                  src='/insta-pics/comment.png'
                  alt='comment'
                  className='w-8 cursor-pointer hover:opacity-50 mb-6'
                />
                <img
                  src='/insta-pics/share.png'
                  alt='share'
                  className='w-8 cursor-pointer hover:opacity-50 mb-6'
                />
                <img
                  onClick={() => {
                    handleSave(post.post_id);
                  }}
                  src={
                    savedPosts.includes(post.post_id)
                      ? '/insta-pics/saved.png'
                      : '/insta-pics/save.png'
                  }
                  alt='save'
                  width={28}
                  className={`cursor-pointer mb-10 ${
                    !savedPosts.includes(post.post_id)
                      ? 'hover:opacity-50 w-8'
                      : 'pl-1'
                  }`}
                />
                <button
                  className='w-8 ml-1 rounded-full cursor-pointer'
                  onClick={() => {
                    navigate(`/${post.creator}`);
                  }}
                >
                  <Avatar>
                    <div className='rounded-full overflow-hidden h-8 w-8 flex items-center justify-center'>
                      <img
                        className='object-cover w-full h-full'
                        src={post.profileImage}
                        alt='Profile'
                      />
                    </div>
                  </Avatar>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Reels;
