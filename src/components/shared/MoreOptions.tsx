const MoreOptions = ({ setOpen }: { setOpen: (arg0: boolean) => void }) => {
  return (
    <div
      onClick={() => setOpen(false)}
      className='w-[100%] h-[100%] fixed bg-[rgba(0,0,0,0.65)] z-50'
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className='fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-white rounded-[10px] flex flex-col justify-center items-between w-[400px] h-[430px]'
      >
        <button className='text-red-500 text-sm font-bold w-full text-center active:bg-zinc-100 border-b-2 border-gray-100 h-[11.1%] py-2 rounded-t-[10px]'>
          Report
        </button>
        <button className='text-red-500 text-sm font-bold w-full text-center active:bg-zinc-100 border-b-2 border-gray-100 h-[11.1%] py-2'>
          Unfollow
        </button>
        <button className='text-sm w-full text-center active:bg-zinc-100 border-b-2 border-gray-100 h-[11.1%] py-2'>
          Add to favorites
        </button>
        <button className='text-sm w-full text-center active:bg-zinc-100 border-b-2 border-gray-100 h-[11.1%] py-2'>
          Go to post
        </button>
        <button className='text-sm w-full text-center active:bg-zinc-100 border-b-2 border-gray-100 h-[11.1%] py-2'>
          Share to...
        </button>
        <button className='text-sm w-full text-center active:bg-zinc-100 border-b-2 border-gray-100 h-[11.1%] py-2'>
          Copy link
        </button>
        <button className='text-sm w-full text-center active:bg-zinc-100 border-b-2 border-gray-100 h-[11.1%] py-2'>
          Embed
        </button>
        <button className='text-sm w-full text-center active:bg-zinc-100 border-b-2 border-gray-100 h-[11.1%] py-2'>
          About this account
        </button>
        <button
          className='text-sm w-full text-center active:bg-zinc-100 rounded-b-[10px] h-[11.1%] py-1.5'
          onClick={() => setOpen(false)}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default MoreOptions;
