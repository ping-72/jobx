import { useState } from "react";
import { GraduationCap, BookOpen, Plus, Trash2, Save } from "lucide-react";

export default function Education() {
  const [educations, setEducations] = useState([
    { id: 1, institute: "", degree: "", startDate: "", endDate: "" },
  ]);
  const [courses, setCourses] = useState([
    { id: 1, name: "", provider: "", completionDate: "" },
  ]);

  const addEducation = () => {
    setEducations([
      ...educations,
      { id: Date.now(), institute: "", degree: "", startDate: "", endDate: "" },
    ]);
  };

  const addCourse = () => {
    setCourses([
      ...courses,
      { id: Date.now(), name: "", provider: "", completionDate: "" },
    ]);
  };

  const removeEducation = (id) => {
    if (educations.length > 1) {
      setEducations(educations.filter((edu) => edu.id !== id));
    }
  };

  const removeCourse = (id) => {
    if (courses.length > 1) {
      setCourses(courses.filter((course) => course.id !== id));
    }
  };

  const handleSave = () => {
    console.log("Saving education and courses data:", { educations, courses });
    // Here you would typically send this data to your backend or perform other save operations
  };

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Education Card */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-green-100 rounded-full">
                <GraduationCap className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Education</h2>
            </div>
            <button
              onClick={addEducation}
              className="p-2 bg-green-100 rounded-full text-green-600 hover:bg-green-200"
              aria-label="Add education"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-6">
            {educations.map((education, index) => (
              <div
                key={education.id}
                className="p-4 border border-gray-200 rounded-md relative"
              >
                {index > 0 && (
                  <button
                    onClick={() => removeEducation(education.id)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                    aria-label="Remove education"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor={`institute-${education.id}`}
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Institute Name
                    </label>
                    <input
                      type="text"
                      id={`institute-${education.id}`}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor={`degree-${education.id}`}
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Degree
                    </label>
                    <input
                      type="text"
                      id={`degree-${education.id}`}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor={`start-date-${education.id}`}
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Start Date
                    </label>
                    <input
                      type="date"
                      id={`start-date-${education.id}`}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor={`end-date-${education.id}`}
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      End Date
                    </label>
                    <input
                      type="date"
                      id={`end-date-${education.id}`}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Courses Card */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-purple-100 rounded-full">
                <BookOpen className="w-6 h-6 text-purple-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Courses</h2>
            </div>
            <button
              onClick={addCourse}
              className="p-2 bg-purple-100 rounded-full text-purple-600 hover:bg-purple-200"
              aria-label="Add course"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-6">
            {courses.map((course, index) => (
              <div
                key={course.id}
                className="p-4 border border-gray-200 rounded-md relative"
              >
                {index > 0 && (
                  <button
                    onClick={() => removeCourse(course.id)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                    aria-label="Remove course"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor={`course-name-${course.id}`}
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Course Name
                    </label>
                    <input
                      type="text"
                      id={`course-name-${course.id}`}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor={`provider-${course.id}`}
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Provider
                    </label>
                    <input
                      type="text"
                      id={`provider-${course.id}`}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label
                      htmlFor={`completion-date-${course.id}`}
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Completion Date
                    </label>
                    <input
                      type="date"
                      id={`completion-date-${course.id}`}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex justify-start">
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <Save className="w-5 h-5 inline-block mr-2" />
          Save
        </button>
      </div>
    </div>
  );
}
