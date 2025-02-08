import React, { useState, useEffect } from 'react';
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
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { collection, getDocs, query, where, addDoc } from 'firebase/firestore';
import { db } from '../config/FirebaseConfig';

const HospitalPage = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [treatments, setTreatments] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const q = query(collection(db, "users"), where("role", "==", "client"));
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

  const handleSubmit = async () => {
    if (!treatments.trim() || !diagnosis.trim() || !note.trim()) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    setSubmitting(true);
    try {
      await addDoc(collection(db, "users", selectedClient.id, "medical_records"), {
        treatments: treatments.trim(),
        diagnosis: diagnosis.trim(),
        note: note.trim(),
        createdAt: new Date().toISOString(),
      });

      Alert.alert("Success", "Record added successfully");
      setModalVisible(false);
      resetForm();
    } catch (error) {
      console.error("Submit error:", error);
      Alert.alert("Error", "Failed to add record: " + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setTreatments('');
    setDiagnosis('');
    setNote('');
    setSelectedClient(null);
  };

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

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicatorComponent size="large" color="#4f46e5" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Client List</Text>
      
      <FlatList
        data={clients}
        renderItem={renderClientItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No clients found</Text>
        }
      />

      <Modal
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
            <Text style={styles.modalHeader}>Add Medical Record</Text>
            <Text style={styles.modalSubHeader}>
              for {selectedClient?.username || 'Client'}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Treatments"
              value={treatments}
              onChangeText={setTreatments}
              multiline
            />

            <TextInput
              style={styles.input}
              placeholder="Diagnosis"
              value={diagnosis}
              onChangeText={setDiagnosis}
              multiline
            />

            <TextInput
              style={styles.noteInput}
              placeholder="Additional Notes..."
              value={note}
              onChangeText={setNote}
              multiline
              numberOfLines={4}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => {
                  setModalVisible(false);
                  resetForm();
                }}
              >
                <Text style={[styles.buttonText, { color: '#64748b' }]}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.submitButton]}
                onPress={handleSubmit}
                disabled={submitting}
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
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    padding: 16,
    backgroundColor: '#fff',
    elevation: 2,
  },
  listContainer: {
    padding: 16,
  },
  clientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },
  clientInfo: {
    flex: 1,
    marginLeft: 12,
  },
  clientName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  clientEmail: {
    fontSize: 14,
    color: '#64748b',
  },
  emptyText: {
    textAlign: 'center',
    color: '#64748b',
    fontSize: 16,
    marginTop: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  modalSubHeader: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 24,
  },
  input: {
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
    minHeight: 50,
  },
  noteInput: {
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: 'top',
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f1f5f9',
  },
  submitButton: {
    backgroundColor: '#4f46e5',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default HospitalPage;