import React, { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useLayoutEffect } from 'react'

const Loading = () => {
    const navigate = useNavigate()
    const { search } = useLocation()
    const query = new URLSearchParams(search)
    const nextUrl = query.get('next')

    useEffect(() => {
        if (nextUrl) {
            setTimeout(() => {
                navigate(`/${nextUrl}`)
            }, 5000)
        }
    }, [nextUrl])

    return (
        <div className='flex justify-center items-center h-screen'>
            <div className='animate-spin rounded-full h-24 w-24 border-4 border-gray-300 border-t-primary'></div>
        </div>
    )
}

export default Loading
