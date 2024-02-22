import Stories from '../../components/shared/Stories';
import PostDetails, { ImageObject } from '../../components/shared/PostDetails';
import Suggestions from '../../components/shared/Suggestions';
import MoreOptions from '@/components/shared/MoreOptions';

const Home = ({
  openComments,
  setOpenLogin,
  open,
  setOpen,
  username,
  email,
  onOpenComments,
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
  onOpenComments: (arg0: ImageObject) => void;
  setOpenLogin: (arg0: boolean) => void;
  email: string | undefined;
  username: string;
  open: boolean;
  setOpen: (arg0: boolean) => void;
}) => {
  return (
    <div className='w-full flex flex-row flex-wrap overflow-auto'>
      {open && <MoreOptions setOpen={setOpen} />}
      <div className='w-full lg:w-[65%] mb-20 mx-auto lg:mx-0'>
        <Stories email={email} username={username} />
        <PostDetails
          likesCount={likesCount}
          setLikesCount={setLikesCount}
          likedPosts={likedPosts}
          setLikedPosts={setLikedPosts}
          savedPosts={savedPosts}
          setSavedPosts={setSavedPosts}
          openComments={openComments}
          onOpenComments={onOpenComments}
          username={username}
          setOpen={setOpen}
        />
      </div>
      <div className='absolute opacity-0 w-0 lg:static lg:w-[35%] lg:opacity-100'>
        <Suggestions
          setOpenLogin={setOpenLogin}
          email={email}
          username={username}
        />
      </div>
    </div>
  );
};

export default Home;
