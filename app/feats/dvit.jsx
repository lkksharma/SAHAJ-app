import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Modal,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
    Alert,
    ActivityIndicatorComponent, 
  } from 'react-native';
import { Appbar, Card, Surface, Divider } from 'react-native-paper';
import { collection, getDocs, query, where, addDoc, doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../../config/FirebaseConfig';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { onAuthStateChanged } from 'firebase/auth';

const InfoRow = ({ label, value }) => (
    <View style={styles.row}>
      <Text style={styles.label}>{label}:</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
  
const doctorsData = [
    { id: '1', name: 'Dr. Aakash Sharma', experience: '10 Years', expertise: 'Cardiologist', location: 'Delhi', image: 'https://via.placeholder.com/150' },
    { id: '2', name: 'Dr. Priya Mehta', experience: '8 Years', expertise: 'Dermatologist', location: 'Mumbai', image: 'https://via.placeholder.com/150' },
    { id: '3', name: 'Dr. Rahul Verma', experience: '15 Years', expertise: 'Neurologist', location: 'Bangalore', image: 'https://via.placeholder.com/150' },
    { id: '4', name: 'Dr. Sneha Gupta', experience: '12 Years', expertise: 'Pediatrician', location: 'Chennai', image: 'https://via.placeholder.com/150' },
];

const DoctorSearch = () => {
    const [clients, setClients] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        fetchClients();
        checkCurrentUser();
    }, []);

    const [currentUser, setCurrentUser] = useState(null);

    const checkCurrentUser = () => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUser(user);
            }
        });
    };

    const handleDoctorSelect = async () => {
        if (!currentUser || !selectedDoctor) {
            Alert.alert("Error", "Please try again");
            return;
        }

        setUpdating(true);
        try {
            const userRef = doc(db, "users", currentUser.uid);
            await updateDoc(userRef, {
                dvit: selectedDoctor.username
            });

            Alert.alert(
                "Success",
                `Dr. ${selectedDoctor.username} has been set as your doctor`,
                [{ text: "OK", onPress: () => setModalVisible(false) }]
            );
        } catch (error) {
            console.error("Error updating doctor:", error);
            Alert.alert("Error", "Failed to update doctor selection");
        } finally {
            setUpdating(false);
        }
    };

    const renderClientItem = ({ item }) => (
        <TouchableOpacity
            style={styles.clientCard}
            onPress={() => {
                setSelectedDoctor(item);
                setModalVisible(true);
            }}
        >
            <MaterialCommunityIcons name="account" size={24} color="#4f46e5" />
            <View style={styles.clientInfo}>
                <Text style={styles.clientName}>{item.username}</Text>
                <Text style={styles.clientEmail}>{item.email}</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#94a3b8" />
        </TouchableOpacity>
    );

    const fetchClients = async () => {
        try {
            const q = query(collection(db, "users"), where("role", "==", "doctor"));
            const querySnapshot = await getDocs(q);
            const clientsList = [];
            querySnapshot.forEach((doc) => {
                clientsList.push({ id: doc.id, ...doc.data() });
            });
            setClients(clientsList);
        } catch (error) {
            console.error("Error fetching clients:", error);
            Alert.alert("Error", "Failed to load clients");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Appbar.Header>
                <Appbar.BackAction color="black" onPress={() => router.push('(tabs)')} />
                <Appbar.Content title="Find a Doctor" />
            </Appbar.Header>

            <Surface style={styles.patientCard}>
            <Text style={styles.cardTitle}>Patient Details</Text>
            <Divider style={styles.divider} />
          
            <View style={styles.gridContainer}>
                <View style={styles.column}>
                <InfoRow 
                    icon="account" 
                    label="Patient Name" 
                    value="Mr. Lakksh Sharma" 
                />
                <InfoRow 
                    icon="calendar-account" 
                    label="Age/Gender" 
                    value="19Y 0M 2D /F" 
                />
                <InfoRow 
                    icon="identifier" 
                    label="Aabha. No." 
                    value="ML0193" 
                />
                <InfoRow 
                    icon="medical-bag" 
                    label="Diagnosis" 
                    value="Fever" 
                />
                </View>
                
                <View style={styles.column}>
                <InfoRow 
                    icon="hospital-building" 
                    label="Centre" 
                    value="Fortis Hospital, Gurgaon" 
                />
                <InfoRow 
                    icon="clock-outline" 
                    label="Updated" 
                    value="06/Feb/2025 05:08PM" 
                />
                <InfoRow 
                    icon="doctor" 
                    label="Doctor" 
                    value="Dr. Hinge" 
                />
                <InfoRow 
                    icon="medical-cotton-swab" 
                    label="Treatment" 
                    value="Treatment Plan A" 
                />
                </View>
            </View>
            </Surface>

            <View style={styles.container}>
                
                <TextInput
                    style={styles.searchBar}
                    placeholder="Search by Name, Expertise, Location..."
                    value={searchQuery}
                    onChangeText={text => setSearchQuery(text)}
                />

              <FlatList
                data={clients}
                renderItem={renderClientItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContainer}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>No doctors found</Text>
                }
            />

            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalHeader}>Confirm Doctor Selection</Text>
                        
                        {selectedDoctor && (
                            <View style={styles.doctorInfo}>
                                <Text style={styles.doctorName}>Dr. {selectedDoctor.username}</Text>
                                <Text style={styles.doctorEmail}>{selectedDoctor.email}</Text>
                            </View>
                        )}

                        <Text style={styles.modalText}>
                            Would you like to select this doctor as your healthcare provider?
                        </Text>

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.button, styles.cancelButton]}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.button, styles.confirmButton]}
                                onPress={handleDoctorSelect}
                                disabled={updating}
                            >
                                {updating ? (
                                    <ActivityIndicator size="small" color="#fff" />
                                ) : (
                                    <Text style={styles.confirmButtonText}>Confirm</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#f9f9f9',
    },
    searchBar: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 8,
        fontSize: 16,
        marginBottom: 10,
        elevation: 2,
    },
    card: {
        marginBottom: 10,
        padding: 10,
        borderRadius: 8,
        elevation: 3,
        backgroundColor: 'white',
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    image: {
        width: 70,
        height: 70,
        borderRadius: 35,
        marginRight: 15,
    },
    textContainer: {
        flex: 1,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    details: {
        fontSize: 14,
        color: 'gray',
    },
    location: {
        fontSize: 14,
        color: '#6200ea',
    },
    patientCard: {
        borderRadius: 12,
        elevation: 4,
        marginBottom: 16,
        overflow: 'hidden',
      },
      cardTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        padding: 16,
      },
      divider: {
        height: 1,
        backgroundColor: '#e0e0e0',
      },
      gridContainer: {
        flexDirection: 'row',
        padding: 16,
      },
      column: {
        flex: 1,
      },
      infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
      },
      modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        width: '90%',
        maxWidth: 400,
    },
    modalHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    doctorInfo: {
        backgroundColor: '#f5f5f5',
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
    },
    doctorName: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 5,
    },
    doctorEmail: {
        fontSize: 16,
        color: '#666',
    },
    modalText: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
        color: '#666',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
    },
    button: {
        flex: 1,
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#f5f5f5',
    },
    confirmButton: {
        backgroundColor: '#4f46e5',
    },
    cancelButtonText: {
        color: '#666',
        fontSize: 16,
        fontWeight: '600',
    },
    confirmButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
  },
  modalContent: {
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 20,
      width: '90%',
      maxWidth: 400,
  },
  modalHeader: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center',
  },
  doctorInfo: {
      backgroundColor: '#f5f5f5',
      padding: 15,
      borderRadius: 10,
      marginBottom: 20,
  },
  doctorName: {
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 5,
  },
  doctorEmail: {
      fontSize: 16,
      color: '#666',
  },
  modalText: {
      fontSize: 16,
      marginBottom: 20,
      textAlign: 'center',
      color: '#666',
  },
  modalButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 10,
  },
  button: {
      flex: 1,
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
  },
  cancelButton: {
      backgroundColor: '#f5f5f5',
  },
  confirmButton: {
      backgroundColor: '#4f46e5',
  },
  cancelButtonText: {
      color: '#666',
      fontSize: 16,
      fontWeight: '600',
  },
  confirmButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
  },
});

export default DoctorSearch;