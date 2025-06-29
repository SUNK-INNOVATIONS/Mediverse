import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, Plus, Phone, Edit3, Trash2, Shield, AlertTriangle } from 'lucide-react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadow } from '@/constants/theme';

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  isPrimary: boolean;
}

export default function EmergencyContactsScreen() {
  const [contacts, setContacts] = useState<EmergencyContact[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      phone: '+1 (555) 123-4567',
      relationship: 'Sister',
      isPrimary: true,
    },
    {
      id: '2',
      name: 'Dr. Michael Chen',
      phone: '+1 (555) 987-6543',
      relationship: 'Therapist',
      isPrimary: false,
    },
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    relationship: '',
  });

  const handleSave = () => {
    if (!formData.name || !formData.phone) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (editingId) {
      // Update existing contact
      setContacts(prev => prev.map(contact => 
        contact.id === editingId 
          ? { ...contact, ...formData }
          : contact
      ));
      setEditingId(null);
    } else {
      // Add new contact
      const newContact: EmergencyContact = {
        id: Date.now().toString(),
        ...formData,
        isPrimary: contacts.length === 0,
      };
      setContacts(prev => [...prev, newContact]);
      setIsAdding(false);
    }

    setFormData({ name: '', phone: '', relationship: '' });
  };

  const handleEdit = (contact: EmergencyContact) => {
    setFormData({
      name: contact.name,
      phone: contact.phone,
      relationship: contact.relationship,
    });
    setEditingId(contact.id);
    setIsAdding(true);
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      'Delete Contact',
      'Are you sure you want to remove this emergency contact?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setContacts(prev => prev.filter(contact => contact.id !== id));
          },
        },
      ]
    );
  };

  const handleCall = (phone: string) => {
    Alert.alert(
      'Call Emergency Contact',
      `Do you want to call ${phone}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Call',
          onPress: () => {
            // In a real app, this would initiate a phone call
            console.log('Calling:', phone);
          },
        },
      ]
    );
  };

  const setPrimary = (id: string) => {
    setContacts(prev => prev.map(contact => ({
      ...contact,
      isPrimary: contact.id === id,
    })));
  };

  const ContactForm = () => (
    <View style={styles.formContainer}>
      <Text style={styles.formTitle}>
        {editingId ? 'Edit Contact' : 'Add Emergency Contact'}
      </Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Name *</Text>
        <TextInput
          style={styles.input}
          value={formData.name}
          onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
          placeholder="Enter full name"
          placeholderTextColor={Colors.gray500}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Phone Number *</Text>
        <TextInput
          style={styles.input}
          value={formData.phone}
          onChangeText={(text) => setFormData(prev => ({ ...prev, phone: text }))}
          placeholder="+1 (555) 123-4567"
          placeholderTextColor={Colors.gray500}
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Relationship</Text>
        <TextInput
          style={styles.input}
          value={formData.relationship}
          onChangeText={(text) => setFormData(prev => ({ ...prev, relationship: text }))}
          placeholder="e.g., Family, Friend, Therapist"
          placeholderTextColor={Colors.gray500}
        />
      </View>

      <View style={styles.formActions}>
        <TouchableOpacity 
          style={styles.cancelButton} 
          onPress={() => {
            setIsAdding(false);
            setEditingId(null);
            setFormData({ name: '', phone: '', relationship: '' });
          }}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>
            {editingId ? 'Update' : 'Save'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={Colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Emergency Contacts</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Warning Banner */}
        <View style={styles.warningBanner}>
          <AlertTriangle size={24} color={Colors.orange} />
          <View style={styles.warningContent}>
            <Text style={styles.warningTitle}>Important</Text>
            <Text style={styles.warningText}>
              These contacts will be notified if you're in crisis. Make sure they're aware and available to help.
            </Text>
          </View>
        </View>

        {/* Add Contact Button */}
        {!isAdding && (
          <TouchableOpacity 
            style={styles.addButton} 
            onPress={() => setIsAdding(true)}
          >
            <Plus size={24} color={Colors.white} />
            <Text style={styles.addButtonText}>Add Emergency Contact</Text>
          </TouchableOpacity>
        )}

        {/* Contact Form */}
        {isAdding && <ContactForm />}

        {/* Contacts List */}
        <View style={styles.contactsSection}>
          <Text style={styles.sectionTitle}>Your Emergency Contacts</Text>
          
          {contacts.length === 0 ? (
            <View style={styles.emptyState}>
              <Shield size={48} color={Colors.gray400} />
              <Text style={styles.emptyTitle}>No Emergency Contacts</Text>
              <Text style={styles.emptyText}>
                Add trusted people who can help you during difficult times
              </Text>
            </View>
          ) : (
            contacts.map((contact) => (
              <View key={contact.id} style={styles.contactCard}>
                <View style={styles.contactHeader}>
                  <View style={styles.contactInfo}>
                    <Text style={styles.contactName}>{contact.name}</Text>
                    {contact.isPrimary && (
                      <View style={styles.primaryBadge}>
                        <Text style={styles.primaryText}>Primary</Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.contactActions}>
                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={() => handleEdit(contact)}
                    >
                      <Edit3 size={16} color={Colors.gray600} />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={() => handleDelete(contact.id)}
                    >
                      <Trash2 size={16} color={Colors.error} />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.contactDetails}>
                  <Text style={styles.contactPhone}>{contact.phone}</Text>
                  {contact.relationship && (
                    <Text style={styles.contactRelationship}>{contact.relationship}</Text>
                  )}
                </View>

                <View style={styles.contactFooter}>
                  <TouchableOpacity 
                    style={styles.callButton}
                    onPress={() => handleCall(contact.phone)}
                  >
                    <Phone size={16} color={Colors.white} />
                    <Text style={styles.callButtonText}>Call</Text>
                  </TouchableOpacity>

                  {!contact.isPrimary && (
                    <TouchableOpacity 
                      style={styles.primaryButton}
                      onPress={() => setPrimary(contact.id)}
                    >
                      <Text style={styles.primaryButtonText}>Set as Primary</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))
          )}
        </View>

        {/* Crisis Resources */}
        <View style={styles.resourcesSection}>
          <Text style={styles.sectionTitle}>Crisis Resources</Text>
          
          <View style={styles.resourceCard}>
            <Text style={styles.resourceTitle}>National Suicide Prevention Lifeline</Text>
            <Text style={styles.resourcePhone}>988</Text>
            <Text style={styles.resourceDescription}>
              24/7 free and confidential support for people in distress
            </Text>
            <TouchableOpacity 
              style={styles.resourceButton}
              onPress={() => handleCall('988')}
            >
              <Phone size={16} color={Colors.white} />
              <Text style={styles.resourceButtonText}>Call 988</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.resourceCard}>
            <Text style={styles.resourceTitle}>Crisis Text Line</Text>
            <Text style={styles.resourcePhone}>Text HOME to 741741</Text>
            <Text style={styles.resourceDescription}>
              Free, 24/7 support for those in crisis
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.warmGray,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  headerTitle: {
    ...Typography.heading,
    color: Colors.black,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
  },
  warningBanner: {
    flexDirection: 'row',
    backgroundColor: Colors.orange + '10',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginTop: Spacing.xl,
    marginBottom: Spacing.xl,
    borderLeftWidth: 4,
    borderLeftColor: Colors.orange,
  },
  warningContent: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  warningTitle: {
    ...Typography.paragraph,
    color: Colors.orange,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: Spacing.sm,
  },
  warningText: {
    ...Typography.secondary,
    color: Colors.gray700,
    lineHeight: 20,
  },
  addButton: {
    backgroundColor: Colors.lavender,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.xl,
    ...Shadow.medium,
  },
  addButtonText: {
    ...Typography.paragraph,
    color: Colors.white,
    marginLeft: Spacing.sm,
    fontFamily: 'Poppins-SemiBold',
  },
  formContainer: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    ...Shadow.small,
  },
  formTitle: {
    ...Typography.heading,
    color: Colors.black,
    marginBottom: Spacing.lg,
  },
  inputGroup: {
    marginBottom: Spacing.lg,
  },
  inputLabel: {
    ...Typography.secondary,
    color: Colors.gray700,
    marginBottom: Spacing.sm,
    fontFamily: 'Poppins-SemiBold',
  },
  input: {
    backgroundColor: Colors.gray100,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    ...Typography.paragraph,
    color: Colors.black,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  formActions: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: Colors.gray200,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  cancelButtonText: {
    ...Typography.secondary,
    color: Colors.gray700,
    fontFamily: 'Poppins-SemiBold',
  },
  saveButton: {
    flex: 1,
    backgroundColor: Colors.lavender,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  saveButtonText: {
    ...Typography.secondary,
    color: Colors.white,
    fontFamily: 'Poppins-SemiBold',
  },
  contactsSection: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    ...Typography.heading,
    color: Colors.black,
    marginBottom: Spacing.lg,
  },
  emptyState: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.huge,
    alignItems: 'center',
    ...Shadow.small,
  },
  emptyTitle: {
    ...Typography.paragraph,
    color: Colors.black,
    fontFamily: 'Poppins-SemiBold',
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  emptyText: {
    ...Typography.secondary,
    color: Colors.gray600,
    textAlign: 'center',
    lineHeight: 20,
  },
  contactCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadow.small,
  },
  contactHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    ...Typography.paragraph,
    color: Colors.black,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: Spacing.xs,
  },
  primaryBadge: {
    backgroundColor: Colors.green + '20',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.xl,
    alignSelf: 'flex-start',
  },
  primaryText: {
    ...Typography.small,
    color: Colors.green,
    fontFamily: 'Poppins-SemiBold',
  },
  contactActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.gray100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactDetails: {
    marginBottom: Spacing.lg,
  },
  contactPhone: {
    ...Typography.secondary,
    color: Colors.gray700,
    marginBottom: Spacing.xs,
  },
  contactRelationship: {
    ...Typography.small,
    color: Colors.gray600,
  },
  contactFooter: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  callButton: {
    backgroundColor: Colors.green,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  callButtonText: {
    ...Typography.secondary,
    color: Colors.white,
    marginLeft: Spacing.sm,
    fontFamily: 'Poppins-SemiBold',
  },
  primaryButton: {
    backgroundColor: Colors.gray200,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  primaryButtonText: {
    ...Typography.secondary,
    color: Colors.gray700,
    fontFamily: 'Poppins-SemiBold',
  },
  resourcesSection: {
    marginBottom: Spacing.huge,
  },
  resourceCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadow.small,
  },
  resourceTitle: {
    ...Typography.paragraph,
    color: Colors.black,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: Spacing.sm,
  },
  resourcePhone: {
    ...Typography.subtitle,
    color: Colors.lavender,
    fontFamily: 'Poppins-Bold',
    marginBottom: Spacing.sm,
  },
  resourceDescription: {
    ...Typography.secondary,
    color: Colors.gray600,
    lineHeight: 20,
    marginBottom: Spacing.lg,
  },
  resourceButton: {
    backgroundColor: Colors.error,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  resourceButtonText: {
    ...Typography.secondary,
    color: Colors.white,
    marginLeft: Spacing.sm,
    fontFamily: 'Poppins-SemiBold',
  },
});