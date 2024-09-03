import React, { useState } from 'react';
import { Save, Plus, X } from 'react-feather';

export default function ExperienceForm() {
  const [experiences, setExperiences] = useState([
    { id: 1, company: '', position: '', startDate: '', endDate: '', description: '', currentlyWorking: false }
  ]);

  const addExperience = () => {
    const newId = experiences.length > 0 ? Math.max(...experiences.map(e => e.id)) + 1 : 1;
    setExperiences([...experiences, { id: newId, company: '', position: '', startDate: '', endDate: '', description: '', currentlyWorking: false }]);
  };

  const removeExperience = (id) => {
    setExperiences(experiences.filter(experience => experience.id !== id));
  };

  const handleInputChange = (id, field, value) => {
    setExperiences(experiences.map(experience => 
      experience.id === id ? { ...experience, [field]: value } : experience
    ));
  };

  const handleSave = () => {
    console.log('Saving experiences:', experiences);
    // Implement your save logic here
  };

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Work Experience</h2>
          <button
            onClick={addExperience}
            className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            <Plus className="w-5 h-5 inline-block mr-1" />
            Add Experience
          </button>
        </div>
        <div className="space-y-6">
          {experiences.map((experience) => (
            <div key={experience.id} className="p-4 border border-gray-200 rounded-md relative">
              <button
                onClick={() => removeExperience(experience.id)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor={`company-${experience.id}`} className="block text-sm font-medium text-gray-700">
                    Company
                  </label>
                  <input
                    type="text"
                    id={`company-${experience.id}`}
                    value={experience.company}
                    onChange={(e) => handleInputChange(experience.id, 'company', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label htmlFor={`position-${experience.id}`} className="block text-sm font-medium text-gray-700">
                    Position
                  </label>
                  <input
                    type="text"
                    id={`position-${experience.id}`}
                    value={experience.position}
                    onChange={(e) => handleInputChange(experience.id, 'position', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label htmlFor={`startDate-${experience.id}`} className="block text-sm font-medium text-gray-700">
                    Start Date
                  </label>
                  <input
                    type="date"
                    id={`startDate-${experience.id}`}
                    value={experience.startDate}
                    onChange={(e) => handleInputChange(experience.id, 'startDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label htmlFor={`endDate-${experience.id}`} className="block text-sm font-medium text-gray-700">
                    End Date
                  </label>
                  <input
                    type="date"
                    id={`endDate-${experience.id}`}
                    value={experience.endDate}
                    onChange={(e) => handleInputChange(experience.id, 'endDate', e.target.value)}
                    disabled={experience.currentlyWorking}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div className="sm:col-span-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id={`currentlyWorking-${experience.id}`}
                      checked={experience.currentlyWorking}
                      onChange={(e) => handleInputChange(experience.id, 'currentlyWorking', e.target.checked)}
                      className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                    <label htmlFor={`currentlyWorking-${experience.id}`} className="ml-2 block text-sm text-gray-900">
                      I currently work here
                    </label>
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor={`description-${experience.id}`} className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    id={`description-${experience.id}`}
                    value={experience.description}
                    onChange={(e) => handleInputChange(experience.id, 'description', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>
            </div>
          ))}
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
