import { useGetCourseDetailWithStatusQuery } from "@/features/api/purchaseApi";
import { Navigate, useParams } from "react-router-dom"

export const PurchaseCourseProtectedRoute = ({childern}) => {
    const {courseId} = useParams();
    const {data, isLoading} = useGetCourseDetailWithStatusQuery(courseId);
    
    if(isLoading) return <p>Loading...</p>
    return data?.purchased ? childern : <Navigate to={`/course-detail/${courseId}`} />
}

export default PurchaseCourseProtectedRoute;