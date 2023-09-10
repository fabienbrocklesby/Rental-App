import React from 'react';

function UpdateLogs() {
  return (
    <div className="defaultPageLayout container">
      <h1>EZGEAR.APP UPDATE LOGS</h1>
      <div className="mb-4">
        <p>Last Updated: September 7, 2023</p>

        <p>Welcome to EZGear Update Logs!</p>
      </div>

      <div className="mb-4">
        <p className="mb-2">September 11, 2023</p>

        <p>
          Fix scrolling issue on page change
        </p>
      </div>

      <div className="mb-4">
        <p className="mb-2">September 9, 2023</p>

        <p>
          Cart icon added - UI Update
          Scroll animation on page change
        </p>
      </div>

      <div className="mb-4">
        <p className="mb-2">September 7, 2023</p>

        <p>
          Calender booking system implemented.
        </p>
      </div>
      
      <div className="mb-4">
        <p className="mb-2">August 20, 2023</p>

        <p>
          Initial EZGear app launched
        </p>
      </div>
    </div>
  );
}

export default UpdateLogs;
