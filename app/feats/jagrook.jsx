import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Linking,
  SafeAreaView
} from 'react-native';
import { Appbar } from 'react-native-paper';
import { useRouter } from 'expo-router';

const Jagrook = () => {
  const router = useRouter();

  const governmentResources = [
    {
      title: 'ABHA (Ayushman Bharat Health Account)',
      description: 'Create your unique health ID and access digital health records securely.',
      link: 'https://abha.abdm.gov.in/',
    },
    {
      title: 'National Health Portal',
      description: 'Gateway to authentic health information and Indian health services.',
      link: 'https://www.ncd.nhp.gov.in/',
    },
    {
      title: 'Ministry of Health and Family Welfare',
      description: 'Official portal for health policies and programs in India.',
      link: 'https://www.mohfw.gov.in/',
    },
    {
      title: 'Indian Council of Medical Research',
      description: 'Latest medical research and health guidelines.',
      link: 'https://www.icmr.gov.in/',
    },
  ];

  const diseaseVideos = [
    {
      title: 'Understanding Diabetes',
      thumbnail: '../../assets/images/diabetes.jpeg',
      link: 'https://youtu.be/XfyGv-xwjlI?si=eoz3gDLUCVOffBT9',
    },
    {
      title: 'Heart Disease Prevention',
      thumbnail: '../../assets/images/Heart.avif',
      link: 'https://youtu.be/Oqt9TgWcrxI?si=URG1vAS70tEQa5rw',
    },
    {
      title: 'Managing Hypertension',
      thumbnail: '../../assets/images/hyper.png',
      link: 'https://youtu.be/r5XTTeP039Q?si=JMqMPKLpUvXcDzAt',
    },
    {
      title: 'Mental Health Awareness',
      thumbnail: '../../assets/images/mental.jpg',
      link: 'https://youtu.be/gy1iH_Gxn0Q?si=SnMXZg1r-uS_l3mK',
    },
  ];

  const medicineInfo = [
    {
      title: 'Prescription Medicines',
      warnings: [
        'Never self-medicate',
        'Always consult a qualified healthcare professional',
        'Complete the full course as prescribed',
        'Check for allergies and contraindications',
      ],
    },
    {
      title: 'Medicine Storage',
      warnings: [
        'Store in a cool, dry place',
        'Keep away from direct sunlight',
        'Store out of reach of children',
        'Check expiration dates regularly',
      ],
    },
    {
      title: 'Side Effects',
      warnings: [
        'Monitor for adverse reactions',
        'Report unusual symptoms to your doctor',
        'Keep track of all medications taken',
        'Be aware of drug interactions',
      ],
    },
  ];

  const openLink = (url) => {
    Linking.openURL(url);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.push('(tabs)')} />
        <Text style={styles.headerTitle}>Jagrook</Text>
      </Appbar.Header>

      <ScrollView style={styles.scrollView}>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Government Healthcare Resources</Text>
          <View style={styles.resourcesGrid}>
            {governmentResources.map((resource, index) => (
              <TouchableOpacity
                key={index}
                style={styles.card}
                onPress={() => openLink(resource.link)}
              >
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>{resource.title}</Text>
                  <Text style={styles.cardDescription}>{resource.description}</Text>
                </View>
                <Text style={styles.linkText}>Visit Website</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Educational Videos</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {diseaseVideos.map((video, index) => (
              <TouchableOpacity
                key={index}
                style={styles.videoCard}
                onPress={() => openLink(video.link)}
              >
                <Image
                  source={{ uri: video.thumbnail }}
                  style={styles.thumbnail}
                />
                <Text style={styles.videoTitle}>{video.title}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Medicine Safety Information</Text>
          <View style={styles.medicineGrid}>
            {medicineInfo.map((info, index) => (
              <View key={index} style={styles.warningCard}>
                <Text style={styles.warningTitle}>{info.title}</Text>
                {info.warnings.map((warning, wIndex) => (
                  <Text key={wIndex} style={styles.warningText}>
                    • {warning}
                  </Text>
                ))}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 20,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  resourcesGrid: {
    gap: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
  },
  linkText: {
    color: '#2196F3',
    fontSize: 16,
  },
  videoCard: {
    width: 320,
    marginRight: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  thumbnail: {
    width: '100%',
    height: 180,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  videoTitle: {
    padding: 12,
    fontSize: 16,
    fontWeight: '600',
  },
  medicineGrid: {
    gap: 16,
  },
  warningCard: {
    backgroundColor: '#FFF3E0',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  warningTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#F57C00',
  },
  warningText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    lineHeight: 20,
  },
});

export default Jagrook;