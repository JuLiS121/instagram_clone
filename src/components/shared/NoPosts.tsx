const NoPosts = ({
  setOpenCreate,
  username,
  user,
}: {
  username: string | undefined;
  user: string | undefined;
  setOpenCreate: (arg0: boolean) => void;
}) => {
  return (
    <div className='mx-auto flex flex-col items-center justify-center gap-5  mt-16'>
      {user === username ? (
        <>
          <img
            onClick={() => setOpenCreate(true)}
            src='/insta-pics/camera.png'
            alt='add posts'
            className='w-20 cursor-pointer'
          />
          <span className='font-black text-4xl'>Share Photos</span>
          <span className='text-sm font-normal'>
            When you share photos, they will appear on your profile.
          </span>
          <span
            className='text-sm text-cyan-500 font-normal hover:text-cyan-950 cursor-pointer'
            onClick={() => setOpenCreate(true)}
          >
            Share your first photo
          </span>
        </>
      ) : (
        <div className='flex flex-col items-center gap-2 justify-center flex-wrap'>
          <img
            src='/insta-pics/camera.png'
            alt='add posts'
            className='w-20 cursor-pointer'
          />
          <span className='font-extrabold text-2xl'>NO POSTS YET</span>
        </div>
      )}
    </div>
  );
};

export default NoPosts;
