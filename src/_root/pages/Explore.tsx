import { useEffect, useState } from 'react';
import { supabase } from './../../config/supabase';
import { ImageObject } from './Profile';
import Loader from '@/components/shared/Loader';
import ExploreSearch from '../../components/shared/ExploreSearch';

const Explore = ({
  username,
  handleOpenComments,
  changeBtn,
}: {
  changeBtn: (arg0: string) => void;
  username: string;
  handleOpenComments: (arg0: ImageObject) => void;
}) => {
  const [posts, setPosts] = useState<ImageObject[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const getPosts = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('imageUrl,creator,post_id,caption,created_at')
          .neq('creator', username);
        if (error) throw error;
        setPosts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    getPosts();
  }, [username]);
  if (loading)
    return (
      <div className='flex-center w-full h-full'>
        <Loader />
      </div>
    );
  return (
    <div className='mx-auto w-full md:w-[85%] mt-20 md:mt-6 abolute h-full flex justify-start flex-wrap gap-1'>
      <ExploreSearch changeBtn={changeBtn} />
      {posts.map((post) => {
        return (
          <div
            key={post.post_id}
            className='w-[32.5%] md:w-[33%] h-40 md:h-80 hover:opacity-90 cursor-pointer'
            onClick={() => handleOpenComments(post)}
          >
            {!(
              post.imageUrl.slice(-3) === 'mp4' ||
              post.imageUrl.slice(-3) === 'mp3'
            ) ? (
              <img
                className='w-full h-full object-cover'
                src={post.imageUrl}
                alt='image'
              />
            ) : (
              <video className='w-full h-full object-cover' controls>
                <source
                  src={post.imageUrl}
                  type={`video/${post.imageUrl.slice(-3)}`}
                />
              </video>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Explore;
