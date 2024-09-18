// ./app/(drawer)/(tabs)/profile.tsx
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";

import useAuthRedirect from "../../../hooks/useAuthRedirect";
import { useGlobalStyles } from "../../../styles/stylesheets/globalStyles";
import { useContext, useEffect } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
import { FirebaseFirestoreService } from "../../../services/firestore/FirebaseFirestoreService";

const Profile = () => {
  const authRedirect = useAuthRedirect();
  const { user, userDetails, setUserDetails } = useContext(AuthContext);
  const { globalStyles } = useGlobalStyles();

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
    <ScrollView contentContainerStyle={globalStyles.container}>
      {userDetails ? (
        <>
          <Image
            source={{ uri: userDetails.photoURL || undefined }}
            style={styles.profileImage}
          />

          <Text style={styles.name}>
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

          <View style={styles.infoSection}>
            <Text style={styles.infoTitle}>Authentication Providers:</Text>
            {userDetails.authProviders.map((provider, index) => (
              <Text key={index} style={styles.infoText}>
                - {provider}
              </Text>
            ))}
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.infoTitle}>Roles:</Text>
            {userDetails.role.map((role, index) => (
              <Text key={index} style={styles.infoText}>
                - {role}
              </Text>
            ))}
          </View>

          {userDetails.permissions && (
            <View style={styles.infoSection}>
              <Text style={styles.infoTitle}>Permissions:</Text>
              {userDetails.permissions.map((permission, index) => (
                <Text key={index} style={styles.infoText}>
                  - {permission}
                </Text>
              ))}
            </View>
          )}

          <View style={styles.infoSection}>
            <Text style={styles.infoTitle}>Account Details:</Text>
            <Text style={styles.infoText}>
              Created At: {userDetails.createdAt.toDate().toDateString()}
            </Text>
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.infoTitle}>Tenant IDs:</Text>
            {userDetails.tenantIds ? (
              userDetails.tenantIds.map((tenantId, index) => (
                <Text key={index} style={styles.infoText}>
                  - {tenantId}
                </Text>
              ))
            ) : (
              <Text style={styles.infoText}>No tenantId</Text>
            )}
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.infoTitle}>Primary Tenant ID:</Text>
            {userDetails.primaryTenantId ? (
              <Text style={styles.infoText}>{userDetails.primaryTenantId}</Text>
            ) : (
              <Text style={styles.infoText}>No primary tenantId</Text>
            )}
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.infoTitle}>Magic Email Used:</Text>
            <Text style={styles.infoText}>
              {userDetails.magicEmailUsed ? "Yes" : "No"}
            </Text>
          </View>
        </>
      ) : (
        <Text>No user details available.</Text>
      )}
    </ScrollView>
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
  infoSection: {
    width: "100%",
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
