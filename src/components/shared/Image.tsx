import { ImageObject } from '@/_root/pages/Profile';

const Image = ({
  images,
  handleOpenComments,
}: {
  images: ImageObject[];
  handleOpenComments: (arg0: ImageObject) => void;
}) => {
  return (
    <div className='left-0 right-0 md:left-[8%] md:right-[7%] items-start md:items-start justify-start absolute gap-1 flex-wrap flex mt-6 max-[768px]:h-full'>
      {images.map((image) => {
        return (
          <div
            className='w-[32.5%] md:w-[33%] h-36 md:h-80 hover:opacity-90 cursor-pointer'
            key={image.post_id}
            onClick={() => handleOpenComments(image)}
          >
            {!(
              image.imageUrl.slice(-3) === 'mp4' ||
              image.imageUrl.slice(-3) === 'mp3'
            ) ? (
              <img className='w-full h-full' src={image.imageUrl} alt='image' />
            ) : (
              <video className='w-full h-full object-cover' controls>
                <source
                  src={image.imageUrl}
                  type={`video/${image.imageUrl.slice(-3)}`}
                />
              </video>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Image;
