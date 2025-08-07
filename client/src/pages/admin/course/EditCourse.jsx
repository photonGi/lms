import { Button } from '@/components/ui/button'
import React from 'react'
import CourseTab from './CourseTab'
import { Link } from 'react-router-dom'

const EditCourse = () => {
    return (
        <div className='flex-1'>
            <div className='flex items-center justify-betweenn mb-5'>
                <h1 className='font-bold text-xl'>Add details information readarding course</h1>
                <Link to="lecture">
                    <Button className="hover:text-blue-600" variant='link'>Go to lectures page</Button>
                </Link>
            </div>
            <CourseTab />

        </div>
    )
}

export default EditCourse