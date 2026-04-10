const images = [
    'https://picsum.photos/id/1/1024/768',
    'https://picsum.photos/id/2/1024/768',
    'https://picsum.photos/id/3/1024/768',
    'https://picsum.photos/id/4/1024/768',
    'https://picsum.photos/id/5/1024/768',
    'https://picsum.photos/id/6/1024/768',
    'https://picsum.photos/id/7/1024/768',
    'https://picsum.photos/id/8/1024/768',
    'https://picsum.photos/id/9/1024/768',
    'https://picsum.photos/id/10/1024/768',
];

const PostGrid = () => {
  return (
    <div className='grid grid-cols-3 gap-1'>
        {images.map((image) => {
            return (
                <img key={image} src={image} alt="" className='w-full aspect-square object-cover' />
            )
        })}
    </div>
  )
}

export default PostGrid