function Pulse({ className }) {
    return <div className={`animate-pulse bg-white/10 rounded ${className}`} />
}

export function SkeletonCard({ layout = 'grid' }) {
    if (layout === 'section') {
        return (
            <div>
                <Pulse className='w-full rounded-lg aspect-[2/3] md:aspect-video' />
                <Pulse className='mt-2 h-4 w-3/4' />
                <Pulse className='mt-1 h-3 w-1/2' />
            </div>
        )
    }
    return (
        <div className='mt-4'>
            <Pulse className='w-full aspect-[2/3] rounded-lg' />
            <div className='bg-[#221f1f] p-4 rounded-md h-60'>
                <Pulse className='h-6 w-3/4 mb-3' />
                <Pulse className='h-4 w-1/2 mb-2' />
                <Pulse className='h-3 w-1/3' />
            </div>
        </div>
    )
}

export function SkeletonMovieDetail() {
    return (
        <div className='container mx-auto px-4 pt-[80px] md:pt-[100px] pb-16'>
            <div className='flex flex-col lg:flex-row gap-6 animate-pulse'>
                <div className='lg:w-[320px] xl:w-[360px] flex-shrink-0'>
                    <div className='bg-white/5 rounded-2xl h-[600px]' />
                </div>
                <div className='flex-1 space-y-4'>
                    <div className='bg-white/5 rounded-2xl h-[80px]' />
                    <div className='bg-white/5 rounded-2xl h-[300px]' />
                </div>
            </div>
        </div>
    )
}

export function SkeletonPlayer() {
    return (
        <div className='pt-[60px] md:pt-[120px] animate-pulse'>
            <div className='w-full bg-white/5' style={{ aspectRatio: '14/7' }} />
            <div className='bg-[#0d0f18] border-b border-white/5 px-4 md:px-8 py-3'>
                <div className='h-5 bg-white/10 rounded w-1/3' />
            </div>
            <div className='max-w-[1400px] mx-auto px-4 md:px-8 py-6 space-y-4'>
                <div className='h-28 bg-white/5 rounded-xl' />
                <div className='h-48 bg-white/5 rounded-xl' />
            </div>
        </div>
    )
}
