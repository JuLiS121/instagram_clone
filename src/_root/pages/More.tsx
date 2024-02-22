import { useNavigate } from 'react-router-dom';

const More = ({
  setToken,
  setOpenLogin,
  changeBtn,
  user,
}: {
  user: string;
  setToken: (arg0: undefined | string) => void;
  setOpenLogin: (arg0: boolean) => void;
  changeBtn: (arg0: string) => void;
}) => {
  const navigate = useNavigate();
  return (
    <div className='fixed bottom-[75px] top-[88px] left-3 rounded-xl w-[270px] border-xl bg-white z-10 flex flex-col justify-center items-between py-1 shadow-2xl'>
      <button className='w-[95%] flex-start mx-auto cursor-pointer bg-white hover:bg-zinc-100 transition hover:rounded-[9px] flex items-center justify-start gap-3 text-center text-black h-[11%]'>
        <img src='/insta-pics/settings.png' alt='Save' className='w-8 pl-4' />
        <span className='text-[14px] pb-0.5'>Settings</span>
      </button>
      <button className=' w-[95%] mx-auto cursor-pointer bg-white hover:bg-zinc-100 transition hover:rounded-[9px] flex items-center justify-start gap-3 text-center text-black h-[11%] pl-4'>
        <img
          src='/insta-pics/activity.svg'
          alt='Save'
          className='w-4 border-2 border-black rounded'
        />
        <span className='text-[14px]'>Your activity</span>
      </button>
      <button
        className=' w-[95%] mx-auto cursor-pointer bg-white hover:bg-zinc-100 transition hover:rounded-[9px] flex items-center justify-start gap-3 text-center text-black h-[11%]'
        onClick={() => navigate(`/${user}/saved`)}
      >
        <img
          src='/insta-pics/save-instagram.png'
          alt='Save'
          className='w-8 pl-4 opacity-100'
        />
        <span className='text-[14px] pb-px'>Saved</span>
      </button>
      <button className=' w-[95%] mx-auto cursor-pointer bg-white hover:bg-zinc-100 transition hover:rounded-[9px] flex items-center justify-start gap-3 text-center text-black h-[11%]'>
        <img src='/insta-pics/sun.png' alt='Save' className='w-9 pl-3' />
        <span className='text-[14px]'>Switch apperance</span>
      </button>
      <button className=' w-[95%] mx-auto cursor-pointer bg-white hover:bg-zinc-100 transition hover:rounded-[9px] flex items-center justify-start gap-3 text-center text-black h-[11%]'>
        <img src='/insta-pics/problem.png' alt='Save' className='w-9 pl-3' />
        <span className='text-[14px]'>Report a problem</span>
      </button>
      <span className='h-1.5 bg-gray-100 my-2'>
        <hr />
      </span>
      <button className='mb-2 w-[95%] mx-auto cursor-pointer bg-white hover:bg-zinc-100 transition hover:rounded-[9px] flex items-center justify-start gap-3 text-center text-black h-[12%]'>
        <img
          src='/insta-pics/threads.png'
          alt='Save'
          className='w-[33px] pl-4'
        />
        <span className='text-[14px]'>Threads</span>
      </button>
      <span className='h-1.5 bg-gray-100 mb-2'>
        <hr />
      </span>
      <button
        onClick={() => {
          changeBtn('');
          setOpenLogin(true);
        }}
        className='mb-1.5 w-[95%] mx-auto cursor-pointer bg-white hover:bg-zinc-100 transition hover:rounded-[9px] flex items-center justify-start gap-3 text-center text-black h-[11%]'
      >
        <span className='text-[14px] pl-4'>Switch accounts</span>
      </button>
      <span className='h-1 my-1 '>
        <hr />
      </span>
      <button
        className='w-[95%] mx-auto cursor-pointer bg-white hover:bg-zinc-100 transition hover:rounded-[9px] flex items-center justify-start gap-3 text-center text-black h-[11%]'
        onClick={() => {
          setToken(undefined);
          sessionStorage.removeItem('token');
          navigate('/sign-in');
        }}
      >
        <span className='text-[14px] pl-4'>Log out</span>
      </button>
    </div>
  );
};

export default More;
