import { Avatar } from '@radix-ui/react-avatar';
import { useNavigate } from 'react-router-dom';
import { CommentType } from './Comment';
import { useEffect, useState } from 'react';
import { getUserProfilePc } from '@/config/api';
import { TimeDifference } from './PostDetails';
import Loader from './Loader';

const SingleComment = ({
  comment,
  onCloseComments,
}: {
  comment: CommentType;
  onCloseComments: () => void;
}) => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState('');
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const getProfilePic = async () => {
      setLoading(true);
      try {
        const data = await getUserProfilePc(comment.commenter);
        if (data) setProfile(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    getProfilePic();
  }, [comment.commenter]);
  function getTimeAgo(timestamp: Date): string {
    const currentDate: Date = new Date();
    const createdAtDate: Date = new Date(timestamp);

    const timeDifferenceInSeconds: number = Math.floor(
      (currentDate.getTime() - createdAtDate.getTime()) / 1000
    );

    const timeDifference: TimeDifference = {
      years: 0,
      months: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: timeDifferenceInSeconds,
    };

    timeDifference.years = Math.floor(timeDifference.seconds / 31536000);
    timeDifference.seconds %= 31536000;

    timeDifference.months = Math.floor(timeDifference.seconds / 2592000);
    timeDifference.seconds %= 2592000;

    timeDifference.days = Math.floor(timeDifference.seconds / 86400);
    timeDifference.seconds %= 86400;

    timeDifference.hours = Math.floor(timeDifference.seconds / 3600);
    timeDifference.seconds %= 3600;

    timeDifference.minutes = Math.floor(timeDifference.seconds / 60);
    timeDifference.seconds %= 60;

    if (timeDifference.years > 0) {
      return `${timeDifference.years}y`;
    } else if (timeDifference.months > 0) {
      return `${timeDifference.months}mo`;
    } else if (timeDifference.days > 0) {
      return `${timeDifference.days}d`;
    } else if (timeDifference.hours > 0) {
      return `${timeDifference.hours}h`;
    } else if (timeDifference.minutes > 0) {
      return `${timeDifference.minutes}m`;
    } else {
      return 'Now';
    }
  }
  if (loading) return <Loader />;
  return (
    <div className='h-[15%] mb-7 md:mb-2 text-ellipsis whitespace-nowrap flex items-center justify-between px-2'>
      <div className='flex items-center justify-center px-1 h-full'>
        <button
          className='w-8 rounded-full cursor-pointer pb-2'
          onClick={() => {
            onCloseComments();
            navigate(`/${comment.commenter}`);
          }}
        >
          <Avatar>
            <div className='rounded-full overflow-hidden h-8 w-8 flex items-center justify-center'>
              <img
                className='object-cover w-full h-full'
                src={profile}
                alt='Profile'
              />
            </div>
          </Avatar>
        </button>
        <div className='flex flex-col items-between justify-center'>
          <div className='flex justify-start ml-4 gap-1 items-center mb-1'>
            <span
              className='text-sm font-semibold hover:opacity-80 cursor-pointer'
              onClick={() => {
                onCloseComments();
                navigate(`/${comment.commenter}`);
              }}
            >
              {comment.commenter}
            </span>
            <span className='text-xs'>{comment.comment}</span>
          </div>
          <div className='flex items-center justify-center ml-4 gap-3'>
            <span className='text-xs opacity-60'>
              {getTimeAgo(comment.created_at)}
            </span>
            <span className='text-xs leading-3 font-bold opacity-60'>
              90 likes
            </span>
            <span className='text-xs leading-3 font-bold opacity-60'>
              Reply
            </span>
          </div>
        </div>
      </div>
      <span>
        <img
          className='w-4 opacity-60'
          src='/insta-pics/notifications.png'
          alt=''
        />
      </span>
    </div>
  );
};

export default SingleComment;
