import React from 'react';
import { CourseEditorView } from './CourseEditorView';

export const CreateCourseView: React.FC = () => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <CourseEditorView />
    </div>
  );
};
