import companyData from './CompanyData.json';
import { useState } from 'react';
import JobPopup from './jobPopup';

export default function TrailJob() {

     const [selectedJob, setSelectedJob] = useState(null);
     const [popupstate, setPopupState] = useState(false);

     const openPopup = (job) => {
          setSelectedJob(job);
          setPopupState(true);
     }

     const handleClose = () => {
          setPopupState(false);
          setPopupState(null);
     }

     return (
          <div className="flex flex-col items-center justify-center">
               <h1 className="text-4xl font-bold mb-4">Trail Job</h1>
               <div className="grid bg-pin-200 w-screen  gap-4 mt-2 p-2">
                    {companyData.map((company) => (
                         <div key={company.id} className="cursor-pointer bg-slate-50 hover:shadow-xl w-11/12 mt-5 shadow-lg rounded-md p-4 mx-auto" onClick={() => { openPopup(company) }}>
                              <div className='flex'>
                                   <img src={company.image_link} alt={company.company_name} className="mb-4 h-24  bg-blue-300 w-40 object-contain" />
                                   <div className='ml-6'>
                                        <h2 className=" text-xl font-bold">{company.company_name}</h2>
                                        <p>Company info</p>

                                        <div className='mt-6 justify-start grid grid-cols-3 items-center text-left'>
                                             <p>
                                                  20,000 INR
                                             </p>
                                             <p className="text-gray-700 mx-8">{company.position}</p>
                                             <p className="text-sm text-gray-500 mx-8">{company.location} </p>
                                             <p className="text-sm text-gray-500 mx-8"> {company.onsite_remote}</p>
                                             <p className="text-sm mt-2 mx-8">{company.working_hours} IST</p>
                                             <p className="text-sm mt-2 mx-8">{company.years_of_experience}</p>
                                        </div>
                                   </div>
                                   {/* <div className='bg-purple-200 flex justify-end'>
                                        BookMark
                                   </div> */}
                              </div>


                              <br />
                              <br />
                              <hr />
                              <div>
                                   <p className="text-sm mt-4 font-semibold">Skills:
                                        <div className='mt-4'>
                                             {company.must_have_skills.map((skill, index) => (
                                                  <span key={index} className="bg-orange-400 text-black px-3 py-1 rounded-full mr-2 mt-2">{skill}</span>
                                             ))}
                                        </div>
                                   </p>
                              </div>
                              <div className='flex justify-end'>
                                   <a href={company.application_link} target="_blank" rel="noopener noreferrer" className="flex justify-center text-white bg-orange-500 w-28 hover:bg-orange-400 mt-4 py-2 rounded hover:shadow-lg " >Apply Now</a>
                              </div>
                         </div>
                    ))}
                    {popupstate &&
                         <JobPopup job={selectedJob} popUpState={popupstate} closePopup={handleClose} />}
               </div>
          </div>
     );
}
