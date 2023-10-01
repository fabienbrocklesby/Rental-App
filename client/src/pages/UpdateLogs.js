import React from 'react';

function UpdateLogs() {
  return (
    <div className="defaultPageLayout container">
      <h1>EZGEAR.APP UPDATE LOGS</h1>
      <div className="mb-4">
        <p className="last-updated">Last Updated: October, 2023</p>

        <p>Welcome to EZGear Update Logs!</p>
      </div>

      <div className="mb-4">
        <p className="log-date font-weight-bold fs-5 text-decoration-underline">October 1, 2023</p>

        <p>
          <span>
            **Exciting Business Update**: We're thrilled to announce a game-changing feature on EZGear that opens up new possibilities for businesses and users alike! Starting today, verified accounts can now register as businesses and link their listings directly to their websites. This update allows businesses to utilize EZGear as a powerful advertising platform, paying per click for traffic generated through us.
          </span><br /><br />
          <span>
            **Verification for Authenticity**: To ensure the authenticity of businesses on our platform, each account seeking business status will be personally verified by our dedicated team. This step is crucial in maintaining the integrity and trustworthiness of our marketplace.
          </span><br /><br />

          <span>
            We're incredibly excited about this update, as it enhances the overall user experience and expands opportunities for businesses to reach a broader audience. Stay tuned for more features and improvements as we continue to grow and evolve EZGear!
          </span>
        </p>
      </div>

      <div className="mb-4">
        <p className="log-date font-weight-bold fs-5 text-decoration-underline">September 9, 2023</p>

        <p>
          <span>
            **UI Enhancements**:
          </span><br /><br />

          <span>
            - Added a cart icon for improved navigation.
          </span><br />
          <span>
            - Implemented scroll animation for a smoother page change experience.
          </span>
        </p>
      </div>

      <div className="mb-4">
        <p className="log-date font-weight-bold fs-5 text-decoration-underline">September 7, 2023</p>

        <p>
          **Booking System**: Introduced a calendar booking system for streamlined reservations.
        </p>
      </div>

      <div className="mb-4">
        <p className="log-date font-weight-bold fs-5 text-decoration-underline">August 20, 2023</p>

        <p>
          **Initial Launch**: EZGear app was officially launched, marking the beginning of our journey.
        </p>
      </div>
    </div>
  );
}

export default UpdateLogs;
