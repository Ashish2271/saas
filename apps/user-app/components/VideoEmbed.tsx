'use client'
import { Box } from '@mui/material'

type Props = {
	videoId: string
}

const VideoEmbed = ({ videoId }: Props) => {
	return (
		<Box width="100%" height="100%">
			{videoId}
			<iframe
				src={`https://www.youtube.com/embed/${videoId}?&autoplay=1`}
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
				allowFullScreen
				style={{ border: 'none' }}
			/>
		</Box>
	)
}

export default VideoEmbed
