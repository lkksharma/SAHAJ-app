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

export default function DoctorSearch() {
    const [clients, setClients] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedClient, setSelectedClient] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [treatments, setTreatments] = useState('');

    useEffect(() => {
        fetchClients();
      }, []);
    const filteredDoctors = doctorsData.filter(doctor =>
        doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.expertise.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const renderClientItem = ({ item }) => (
        <TouchableOpacity
          style={styles.clientCard}
          onPress={() => {
            setSelectedClient(item);
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
                          <Text style={styles.emptyText}>No clients found</Text>
                        }
                      />
                      {/* <Modal
                              visible={modalVisible}
                              animationType="slide"
                              transparent={true}
                              onRequestClose={() => {
                                setModalVisible(false);
                                resetForm();
                              }}
                            >
                              <View style={styles.modalOverlay}>
                                <View style={styles.modalContent}>
                                  <Text style={styles.modalHeader}>Doctor Details</Text>
                      
                                  <View style={styles.modalButtons}>
                                    <TouchableOpacity
                                      style={[styles.button, styles.submitButton]}
                                      onPress={handleSubmit}
                                    >
                                      {submitting ? (
                                        <ActivityIndicator size="small" color="#fff" />
                                      ) : (
                                        <Text style={styles.buttonText}>Submit</Text>
                                      )}
                                    </TouchableOpacity>
                                  </View>
                                </View>
                              </View>
                            </Modal> */}
                {/* <FlatList
                    data={filteredDoctors}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <Card style={styles.card}>
                            <View style={styles.cardContent}>
                                <Image source={{ uri: item.image }} style={styles.image} />
                                <View style={styles.textContainer}>
                                    <Text style={styles.name}>{item.name}</Text>
                                    <Text style={styles.details}>{item.expertise} | {item.experience}</Text>
                                    <Text style={styles.location}>📍 {item.location}</Text>
                                </View>
                            </View>
                        </Card>
                    )}
                /> */}
            </View>
        </>
    );
}

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
      }
});
