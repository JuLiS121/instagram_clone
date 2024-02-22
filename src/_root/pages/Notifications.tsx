import { Avatar, AvatarImage } from '@radix-ui/react-avatar';

const Notifications = () => {
  return (
    <div>
      <div className='w-[29.5%] fixed top-0 bottom-0 left-[66px] bg-white rounded-2xl border-x-2 border-gray-100 flex flex-col'>
        <div className='flex items-center justify-between mt-[26px] ml-7 mb-6'>
          <div className='flex items-center justify-between gap-1'>
            <span className='font-bold text-2xl cursor-pointer'>
              Notifications
            </span>
          </div>
          <button className='p-2 mr-6 cursor-pointer font-semibold text-[#0095F5] text-sm hover:bg-gray-200 hover:text-black hover:rounded-3xl'>
            Filter
          </button>
        </div>
        <div className='w-full hover:bg-gray-50 h-16 cursor-pointer flex items-center justify-between mb-3'>
          <div className='pb-2'>
            <button className='w-[35px] border-2 border-white absolute ml-7 rounded-full'>
              <Avatar>
                <AvatarImage width={35} src='/insta-pics/default.png' />
              </Avatar>
            </button>
            <button className='w-[35px] z-10 border-2 border-white relative rounded-full bottom-[-13px] right-[-3px] z-10 bg-white left-[40px]'>
              <Avatar>
                <AvatarImage width={35} src='/insta-pics/default.png' />
              </Avatar>
            </button>
          </div>
          <div className='flex flex-col py-10 items-around justify-center pr-24'>
            <span className='text-sm pt-8 pb-0 font-bold mb-0'>
              Follow requests
            </span>
            <span className='mt-0 text-sm pb-8 pt-0 opacity-70 font-semibold'>
              karim + 8 others
            </span>
          </div>
          <div className='flex items-center justify-center gap-1.5 pr-5'>
            <span className='text-[#0095F5] text-[33px] pb-2'>•</span>
            <img
              src='/insta-pics/right-arrow.png'
              alt=''
              className='w-6 opacity-45 pb-1'
            />
          </div>
        </div>
        <hr />
        <div className='flex flex-col items-between justify-center gap-2 mb-2'>
          <span className='font-bold text-base mt-3.5 ml-7'>Yesterday</span>
          <div className='flex items-center justify-between hover:bg-gray-50 py-2.5 cursor-pointer'>
            <button className='w-[48px] border-2 border-white ml-7 rounded-full'>
              <Avatar>
                <AvatarImage width={48} src='/insta-pics/default.png' />
              </Avatar>
            </button>
            <div className='flex flex-col justify-center items-between pr-6'>
              <span className='leading-4 font-semibold text-sm'>karim</span>
              <span className='leading-4 text-sm '>reuqested to</span>
              <div className='leading-4'>
                <span className='text-sm'>follow you. </span>
                <span className='text-sm opacity-70'>1d</span>
              </div>
            </div>
            <div className='flex items-center justify-around gap-2 pr-6'>
              <button className='bg-[#0095F5] hover:bg-[#1877F6] focus:bg-[#1877F6] active:bg-[#1877F6] transition py-1.5 px-4 rounded-lg font-semibold text-sm text-center text-white transition'>
                Confirm
              </button>
              <button className='bg-slate-200 hover:bg-slate-300 focus:bg-slate-300 active:bg-slate-300 transition py-1.5 px-4 rounded-lg font-semibold text-sm text-center text-black transition'>
                Delete
              </button>
            </div>
          </div>
        </div>
        <hr />
        <div className='flex flex-col items-between justify-center gap-2 mb-2'>
          <span className='font-bold text-base mt-3.5 ml-7'>Earlier</span>
          <div className='flex items-center justify-between hover:bg-gray-50 py-2.5 cursor-pointer'>
            <button className='w-[48px] border-2 border-white ml-7 rounded-full'>
              <Avatar>
                <AvatarImage width={48} src='/insta-pics/default.png' />
              </Avatar>
            </button>
            <div className='flex flex-col justify-center items-between pr-6'>
              <span className='leading-4 font-semibold text-sm'>karim</span>
              <span className='leading-4 text-sm '>reuqested to</span>
              <div className='leading-4'>
                <span className='text-sm'>follow you. </span>
                <span className='text-sm opacity-70'>3w</span>
              </div>
            </div>
            <div className='flex items-center justify-around gap-2 pr-6'>
              <button className='bg-[#0095F5] hover:bg-[#1877F6] focus:bg-[#1877F6] active:bg-[#1877F6] transition py-1.5 px-4 rounded-lg font-semibold text-sm text-center text-white transition'>
                Confirm
              </button>
              <button className='bg-slate-200 hover:bg-slate-300 focus:bg-slate-300 active:bg-slate-300 transition py-1.5 px-4 rounded-lg font-semibold text-sm text-center text-black transition'>
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
