import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateCourseMutation } from "@/features/api/courseApi";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";


const AddCourse = () => {
  const [courseTitle, setCourseTitle] = useState("");
  const [category, setCategory] = useState("");

  const [createCourse, {data, isLoading, error, isSuccess}] = useCreateCourseMutation();
  const navigate = useNavigate();

  const getSelectedCategory = (value) => {
    setCategory(value)
  }
  const createCoursehandler = async () => {
    await createCourse({ courseTitle, category});
  };

  //for displaying toast
  useEffect(() =>{
    if(isSuccess){
      toast.success(data?.message || "Course created.");
      navigate("/admin/courses");
    }
  },[isSuccess, error])

  return (
    <div className="flex-1 mx-10">
      <div className="mb-4">
        <h1 className="font-bold text-xl">Add some basic course detail</h1>
        <p className="text-sm">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Hic, ex.
        </p>
      </div>
      <div className="space-y-10">
        <div>
          <label>Title  </label>
          <input type="text" placeholder="Your Course Name"
          value={courseTitle}
          onChange={(e) => setCourseTitle(e.target.value)}
          />
        </div>
        <div>
          <label>Select</label>
          <Select onValueChange={getSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Category</SelectLabel>
                <SelectItem value="Next JS">Next JS</SelectItem>
                <SelectItem value="Data Science">Data Science</SelectItem>
                <SelectItem value="FrontEnd">FrontEnd Development</SelectItem>
                <SelectItem value="BackEnd">BackEnd Development</SelectItem>
                <SelectItem value="MERN Stack">MERN Stack Development</SelectItem>
                <SelectItem value="Javascript">JavaScript</SelectItem>
                <SelectItem value="Python">Python</SelectItem>
                <SelectItem value="Docker">Docker</SelectItem>
                <SelectItem value="DMBS">DBMS</SelectItem>
                <SelectItem value="HTML, CSS">HTML, CSS</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => navigate("/admin/courses")}>back</Button>
          <Button disable={isLoading} onClick={createCoursehandler}>
            {
              isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : "Create"
            }
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddCourse;
