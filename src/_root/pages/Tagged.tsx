const Tagged = () => {
  return (
    <div className='w-[85%] mx-auto mt-2'>
      <div className='mx-auto flex flex-col items-center justify-center gap-5  mt-16'>
        <span>
          <img
            src='/insta-pics/tagged.png'
            alt='add posts'
            className='w-[66px] p-2 cursor-pointer border-black border-2 rounded-full'
          />
        </span>
        <span className='font-black text-4xl'>Photos of you</span>
        <span className='text-sm font-normal'>
          When people tag you in photos, they'll appear here.
        </span>
      </div>
    </div>
  );
};

export default Tagged;
