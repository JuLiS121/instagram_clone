import { supabase } from '@/config/supabase';
import Loader from '../../components/shared/Loader';
import { useEffect, useState } from 'react';
import { ImageObject } from './Profile';

const Saved = ({
  username,
  handleOpenComments,
}: {
  username: string | undefined;
  handleOpenComments: (arg0: ImageObject) => void;
}) => {
  const [savedPosts, setSavedPosts] = useState<ImageObject[] | null>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    async function fetchSavedPosts() {
      setLoading(true);
      try {
        const { data: savedPosts, error } = await supabase
          .from('saved')
          .select('post_id')
          .eq('username', username);

        if (error) {
          throw error;
        }

        // Extract the post IDs from the saved posts
        const postIds = savedPosts.map((savedPost) => savedPost.post_id);

        // Fetch the post details based on the extracted post IDs
        const { data: postsData, error: postsError } = await supabase
          .from('posts')
          .select('imageUrl,post_id,creator,caption,created_at')
          .in('post_id', postIds);

        if (postsError) {
          throw postsError;
        }

        setSavedPosts(postsData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    // Call the function to fetch saved posts
    fetchSavedPosts();
  }, [username]);
  if (loading) return <Loader />;
  return (
    <div className='left-0 right-0 md:left-[8%] md:right-[7%] items-start md:items-center flex-start absolute gap-1 flex-wrap flex mt-6 mb-[20px] max-[768px]:h-full'>
      {savedPosts?.map((image) => {
        return (
          <div
            className='w-[32.5%] md:w-[33%] h-36 md:h-80 cursor-pointer hover:opacity-90'
            key={image.post_id}
            onClick={() => handleOpenComments(image)}
          >
            {!(
              image.imageUrl.slice(-3) === 'mp4' ||
              image.imageUrl.slice(-3) === 'mp3'
            ) ? (
              <img
                className='w-full h-full object-cover '
                src={image.imageUrl}
                alt='image'
              />
            ) : (
              <video className='w-full h-full object-cover ' controls>
                <source
                  src={image.imageUrl}
                  type={`video/${image.imageUrl.slice(-3)}`}
                />
              </video>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Saved;
