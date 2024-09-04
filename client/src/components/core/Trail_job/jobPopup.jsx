import React from 'react';

const JobPopup = ({ job, popUpState, closePopup }) => {
     if (!popUpState) return null; // Don't render the popup if the popUpState is false

     return (
          <div className="fixed w-screen inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
               <div className="bg-white w-11/12 rounded-lg p-8  mx-auto relative">
                    <button
                         onClick={closePopup}
                         className="absolute top-5 right-8 text-gray-600 hover:text-black"
                    >
                         &times;
                    </button>
                    <h2 className="text-2xl text-center font-bold mb-4">{job.position}</h2>
                    <p className="text-gray-700 mb-2"><strong>Company:</strong> {job.company_name}</p>
                    <p className="text-gray-700 mb-2"><strong>Location:</strong> {job.location}</p>
                    <p className="text-gray-700 mb-2"><strong>Onsite/Remote:</strong> {job.onsite_remote}</p>
                    <p className="text-gray-700 mb-2"><strong>Notice Period:</strong> {job.notice_period}</p>
                    <p className="text-gray-700 mb-2"><strong>Years of Experience:</strong> {job.years_of_experience}</p>
                    <p className="text-gray-700 mb-2"><strong>Working Hours:</strong> {job.working_hours}</p>
                    <p className="text-gray-700 mb-2"><strong>Must Have Skills:</strong> {job.must_have_skills.join(', ')}</p>
                    <p className="text-gray-700 mb-2"><strong>Good to Have Skills:</strong> {job.good_to_have_skills.join(', ')}</p>
                    <p className="text-gray-700 mb-4"><strong>Role:</strong> {job.role}</p>
                    <p className="text-gray-700 mb-4"><strong>About Us:</strong> {job.about_us}</p>
                    <p className="text-gray-700 mb-4"><strong>What Will You Do:</strong> {job.what_will_you_do}</p>
                    <p className="text-gray-700 mb-4"><strong>Who Are You?:</strong> {job.who_are_you}</p>
                    <p className="text-gray-700 mb-4"><strong>Why Us?:</strong> {job.why_us}</p>
                    <div className='flex justify-end right-2 bottom-2 relative'>
                         <a href={job.application_link} target="_blank" rel="noopener noreferrer" className="flex justify-center text-white bg-orange-500 w-28 hover:bg-orange-400 mt-4 py-2 rounded hover:shadow-lg " >Apply Now</a>
                    </div>
               </div>
          </div>
     );
};

export default JobPopup;
