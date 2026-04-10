const images = [
    'https://picsum.photos/id/1/1024/768',
    'https://picsum.photos/id/14/1024/768',
    'https://picsum.photos/id/56/1024/768',
    'https://picsum.photos/id/45/1024/768',
    'https://picsum.photos/id/98/1024/768',
    'https://picsum.photos/id/67/1024/768',
    'https://picsum.photos/id/7/1024/768',
    'https://picsum.photos/id/8/1024/768',
    'https://picsum.photos/id/101/1024/768',
    'https://picsum.photos/id/10/1024/768',
];

const PostGrid = () => {
  return (
    <div className='grid grid-cols-3 gap-1 '>
        {images.map((image) => {
            return (
                <img key={image} src={image} alt="" className='w-full aspect-square object-cover' />
            )
        })}
    </div>
  )
}

export default PostGrid