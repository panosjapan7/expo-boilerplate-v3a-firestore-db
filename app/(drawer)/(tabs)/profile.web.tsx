// ./app/(drawer)/(tabs)/profile.web.tsx
import { useContext, useEffect } from "react";
import useAuthRedirect from "../../../hooks/useAuthRedirect";
import "../../../styles/css/profile.css";
import { useGlobalStyles } from "../../../styles/stylesheets/globalStyles";
import { AuthContext } from "../../../contexts/AuthContext";
import { FirebaseFirestoreService } from "../../../services/firestore/FirebaseFirestoreService";

const Profile = () => {
  const authRedirect = useAuthRedirect();
  const { user, userDetails, setUserDetails } = useContext(AuthContext);
  const { themeTextColor } = useGlobalStyles();

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (user) {
        const details =
          await FirebaseFirestoreService.getUserDetailsFromFirestore(user.uid);
        setUserDetails(details);
      }
    };

    fetchUserDetails();
  }, [user, setUserDetails]);

  if (authRedirect) {
    return authRedirect;
  }

  return (
    <div className="profile-wrapper">
      <div className="contents-container">
        {userDetails ? (
          <div>
            <div className="profilePicture-section">
              <img
                src={userDetails.photoURL || "/assets/defaultProfile.png"}
                alt="Profile"
                className="profile-image"
              />
              <div className="name-email-container">
                <h2 className="name" style={{ color: themeTextColor }}>
                  {userDetails.displayName || "No Name Provided"}
                </h2>

                <div className="email-container">
                  <p className="email">{userDetails.email}</p>
                  <p className="info-text">
                    {userDetails.emailVerified ? (
                      <span className="verified">Verified</span>
                    ) : (
                      <span className="unverified">Unverified</span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className="info-section-container">
              <div className="info-section">
                <h3 className="info-title" style={{ color: themeTextColor }}>
                  Authentication Providers:
                </h3>
                <ul>
                  {userDetails.authProviders.map((provider, index) => (
                    <li
                      key={index}
                      className="info-text"
                      style={{ color: themeTextColor }}
                    >
                      {provider}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="info-section">
                <h3 className="info-title" style={{ color: themeTextColor }}>
                  Roles:
                </h3>
                <ul>
                  {userDetails.role.map((role, index) => (
                    <li
                      key={index}
                      className="info-text"
                      style={{ color: themeTextColor }}
                    >
                      {role}
                    </li>
                  ))}
                </ul>
              </div>

              {userDetails.permissions && (
                <div className="info-section">
                  <h3 className="info-title" style={{ color: themeTextColor }}>
                    Permissions:
                  </h3>
                  <ul>
                    {userDetails.permissions.map((permission, index) => (
                      <li
                        key={index}
                        className="info-text"
                        style={{ color: themeTextColor }}
                      >
                        {permission}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="info-section">
                <h3 className="info-title" style={{ color: themeTextColor }}>
                  Account Details:
                </h3>
                <p className="info-text" style={{ color: themeTextColor }}>
                  Created At:{" "}
                  {userDetails.createdAt.toDate().toLocaleDateString()}
                </p>
              </div>

              <div className="info-section">
                <h3 className="info-title" style={{ color: themeTextColor }}>
                  Tenant IDs:
                </h3>
                <ul>
                  {userDetails.tenantIds && userDetails.tenantIds.length > 0 ? (
                    userDetails.tenantIds.map((tenantId, index) => (
                      <li
                        key={index}
                        className="info-text"
                        style={{ color: themeTextColor }}
                      >
                        {tenantId}
                      </li>
                    ))
                  ) : (
                    <li className="info-text" style={{ color: themeTextColor }}>
                      No Tenant IDs
                    </li>
                  )}
                </ul>
              </div>

              <div className="info-section">
                <h3 className="info-title" style={{ color: themeTextColor }}>
                  Primary Tenant ID:
                </h3>
                <p className="info-text" style={{ color: themeTextColor }}>
                  {userDetails.primaryTenantId || "No Primary Tenant ID"}
                </p>
              </div>

              <div className="info-section">
                <h3 className="info-title" style={{ color: themeTextColor }}>
                  Magic Email Used:
                </h3>
                <p className="info-text" style={{ color: themeTextColor }}>
                  {userDetails.magicEmailUsed ? "Yes" : "No"}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <p>No user details available.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
