// ./app/(drawer)/(tabs)/profile.tsx
import { useContext, useEffect } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";

import useAuthRedirect from "../../../hooks/useAuthRedirect";
import { useGlobalStyles } from "../../../styles/stylesheets/globalStyles";
import { AuthContext } from "../../../contexts/AuthContext";
import { FirebaseFirestoreService } from "../../../services/firestore/FirebaseFirestoreService";

const Profile = () => {
  const authRedirect = useAuthRedirect();
  const { user, userDetails, setUserDetails } = useContext(AuthContext);
  const { globalStyles, themeBackgroundColor, themeTextColor } =
    useGlobalStyles();

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
    <View style={globalStyles.container}>
      <ScrollView
        bounces={true}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        style={[
          styles.scrollViewContainer,
          { backgroundColor: themeBackgroundColor },
        ]}
      >
        {userDetails ? (
          <>
            <View style={styles.topSectionContainer}>
              <Image
                source={{ uri: userDetails.photoURL || undefined }}
                style={styles.profileImage}
                resizeMode="cover"
              />
              <Text style={[styles.name, { color: themeTextColor }]}>
                {userDetails.displayName || "No Name Provided"}
              </Text>
              <View style={styles.emailContainer}>
                <Text style={styles.email}>{userDetails.email}</Text>
                <Text style={styles.infoText}>
                  {userDetails.emailVerified ? (
                    <Text style={{ color: "green" }}>verified</Text>
                  ) : (
                    <Text style={{ color: "red" }}>unverified</Text>
                  )}
                </Text>
              </View>
            </View>

            <View style={styles.infoSectionContainer}>
              <View style={styles.infoSection}>
                <Text style={[styles.infoTitle, { color: themeTextColor }]}>
                  Authentication Providers:
                </Text>
                {userDetails.authProviders.map((provider, index) => (
                  <Text
                    key={index}
                    style={[styles.infoText, { color: themeTextColor }]}
                  >
                    - {provider}
                  </Text>
                ))}
              </View>

              <View style={styles.infoSection}>
                <Text style={[styles.infoTitle, { color: themeTextColor }]}>
                  Roles:
                </Text>
                {userDetails.role.map((role, index) => (
                  <Text
                    key={index}
                    style={[styles.infoText, { color: themeTextColor }]}
                  >
                    - {role}
                  </Text>
                ))}
              </View>

              {userDetails.permissions && (
                <View style={styles.infoSection}>
                  <Text style={[styles.infoTitle, { color: themeTextColor }]}>
                    Permissions:
                  </Text>
                  {userDetails.permissions.map((permission, index) => (
                    <Text
                      key={index}
                      style={[styles.infoText, { color: themeTextColor }]}
                    >
                      - {permission}
                    </Text>
                  ))}
                </View>
              )}

              <View style={styles.infoSection}>
                <Text style={[styles.infoTitle, { color: themeTextColor }]}>
                  Account Details:
                </Text>
                <Text style={[styles.infoText, { color: themeTextColor }]}>
                  Created At: {userDetails.createdAt.toDate().toDateString()}
                </Text>
              </View>

              <View style={styles.infoSection}>
                <Text style={[styles.infoTitle, { color: themeTextColor }]}>
                  Tenant IDs:
                </Text>
                {userDetails.tenantIds ? (
                  userDetails.tenantIds.map((tenantId, index) => (
                    <Text
                      key={index}
                      style={[styles.infoText, { color: themeTextColor }]}
                    >
                      - {tenantId}
                    </Text>
                  ))
                ) : (
                  <Text style={[styles.infoText, { color: themeTextColor }]}>
                    No tenantId
                  </Text>
                )}
              </View>

              <View style={styles.infoSection}>
                <Text style={[styles.infoTitle, { color: themeTextColor }]}>
                  Primary Tenant ID:
                </Text>
                {userDetails.primaryTenantId ? (
                  <Text style={[styles.infoText, { color: themeTextColor }]}>
                    {userDetails.primaryTenantId}
                  </Text>
                ) : (
                  <Text style={[styles.infoText, { color: themeTextColor }]}>
                    No primary tenantId
                  </Text>
                )}
              </View>

              <View style={styles.infoSection}>
                <Text style={[styles.infoTitle, { color: themeTextColor }]}>
                  Magic Email Used:
                </Text>
                <Text style={[styles.infoText, { color: themeTextColor }]}>
                  {userDetails.magicEmailUsed ? "Yes" : "No"}
                </Text>
              </View>
            </View>
          </>
        ) : (
          <Text style={[styles.infoTitle, { color: themeTextColor }]}>
            No user details available.
          </Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollViewContainer: {
    width: "100%",
  },
  topSectionContainer: {
    alignItems: "center",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
  },
  name: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 5,
  },
  emailContainer: {
    flexDirection: "row",
  },
  email: {
    fontSize: 16,
    color: "gray",
    marginBottom: 20,
  },
  infoSectionContainer: {
    display: "flex",
    alignSelf: "center",
  },
  infoSection: {
    marginVertical: 10,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 5,
  },
  infoText: {
    fontSize: 16,
    marginLeft: 10,
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
});

export default Profile;
