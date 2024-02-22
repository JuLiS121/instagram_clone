import { ChangeEvent, useState } from 'react';
import { addPost } from '@/config/api';
import Loader from './Loader';

const CreatePost = ({
  setPost,
  post,
  setPostItem,
  postItem,
  changeBtn,
}: {
  changeBtn: (arg0: string) => void;
  post: boolean;
  setPost: (arg0: boolean) => void;
  postItem: { creator: string; imageUrl: string } | null;
  setPostItem: (arg0: null | { creator: string; imageUrl: string }) => void;
}) => {
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const addCap = async (e: ChangeEvent<HTMLFormElement>) => {
    setLoading(true);
    e.preventDefault();
    if (post && postItem)
      try {
        await addPost(postItem.imageUrl, postItem.creator, value);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    setPost(false);
    setPostItem(null);
  };
  if (loading) return <Loader />;
  return (
    <div
      onClick={() => {
        setPost(false);
        setPostItem(null);
      }}
      className='w-[100%] h-[100%] fixed bg-[rgba(0,0,0,0.5)] flex items-center justify-center'
    >
      <span
        onClick={() => {
          setPost(false);
          setPostItem(null);
          changeBtn('');
        }}
        className='text-white absolute cursor-pointer text-3xl fixed top-16 lg:top-2 right-6'
      >
        x
      </span>
      <form
        onClick={(e) => e.stopPropagation()}
        className='fixed top-0 bottom-0 left-0 right-0 lg:top-5 lg:left-[30%] lg:w-[600px] lg:h-[600px] bg-white rounded-[10px] flex flex-col justify-start items-center pt-6'
        onSubmit={addCap}
      >
        <span
          onClick={() => {
            setPost(false);
            setPostItem(null);
            changeBtn('');
          }}
          className='text-black absolute cursor-pointer font-bold text-3xl fixed top-3 lg:opacity-0 lg:right-[10000px] right-3'
        >
          x
        </span>
        {!(
          postItem?.imageUrl.slice(-3) === 'mp4' ||
          postItem?.imageUrl.slice(-3) === 'mp3'
        ) ? (
          <img
            src={postItem?.imageUrl}
            alt='Image'
            className='w-2/3 h-2/3 mb-10'
          />
        ) : (
          <video className='w-2/3 object-cover h-2/3 mb-10' controls>
            <source
              src={postItem.imageUrl}
              type={`video/${postItem.imageUrl.slice(-3)}`}
            />
          </video>
        )}
        <input
          maxLength={100}
          type='text'
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className='w-[90%] h-[10%] border border-zinc-200 mx- rounded-lg pl-3 pb-8 text-wrap max-w-[90%] mb-8'
          placeholder='Add a caption...'
        />
        <button
          className='py-3 px-4 w-1/4 bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold rounded-md cursor-pointer'
          type='submit'
        >
          Upload
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
