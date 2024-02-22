import { Navigate, Outlet } from 'react-router-dom';

const AuthLayout = ({ token }: { token: string | undefined }) => {
  return (
    <>
      {token ? (
        <Navigate to='/' />
      ) : (
        <div className='flex flex-center justify-center items-center gap-[200px]'>
          <img
            src='/insta-pics/insta-post.jpg'
            alt='post'
            className='lg:py-10 lg:w-72 lg:h-screen absolute opacity-0 w-0 lg:static lg:opacity-100'
          />
          <section className='flex flex-col lg:w-max-[320px]'>
            <Outlet />
          </section>
        </div>
      )}
    </>
  );
};

export default AuthLayout;
