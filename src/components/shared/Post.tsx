import { ImageObject } from './PostDetails';

const Post = ({
  post,
  handleOpenComments,
}: {
  post: ImageObject;
  handleOpenComments: (arg0: ImageObject) => void;
}) => {
  return (
    <div
      className='w-[33%] h-80 hover:opacity-90 cursor-pointer'
      onClick={() => handleOpenComments(post)}
    >
      <img className='w-full h-full' src={post.imageUrl} alt='image' />
    </div>
  );
};

export default Post;
