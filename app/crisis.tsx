import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { 
  ArrowLeft, 
  Phone, 
  MessageCircle, 
  Globe, 
  Heart,
  AlertTriangle,
  Users,
  Clock
} from 'lucide-react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadow } from '@/constants/theme';

const crisisResources = [
  {
    id: 1,
    title: 'National Suicide Prevention Lifeline',
    subtitle: '24/7 Crisis Support',
    phone: '988',
    description: 'Free and confidential emotional support for people in suicidal crisis or emotional distress.',
    icon: Phone,
    color: Colors.error,
    urgent: true,
  },
  {
    id: 2,
    title: 'Crisis Text Line',
    subtitle: 'Text HOME to 741741',
    phone: '741741',
    description: 'Free, 24/7 support for those in crisis. Text with a trained crisis counselor.',
    icon: MessageCircle,
    color: Colors.purple,
    urgent: true,
  },
  {
    id: 3,
    title: 'SAMHSA National Helpline',
    subtitle: 'Treatment Referral Service',
    phone: '1-800-662-4357',
    description: 'Free, confidential treatment referral and information service for mental health and substance use disorders.',
    icon: Users,
    color: Colors.green,
    urgent: false,
  },
  {
    id: 4,
    title: 'National Alliance on Mental Illness',
    subtitle: 'NAMI HelpLine',
    phone: '1-800-950-6264',
    description: 'Information, resource referrals and support for individuals and families affected by mental illness.',
    icon: Heart,
    color: Colors.yellow,
    urgent: false,
  },
];

const emergencySteps = [
  {
    step: 1,
    title: 'Call Emergency Services',
    description: 'If you or someone else is in immediate danger, call 911 right away.',
    icon: Phone,
    color: Colors.error,
  },
  {
    step: 2,
    title: 'Reach Out for Support',
    description: 'Contact a crisis hotline, trusted friend, family member, or mental health professional.',
    icon: Users,
    color: Colors.purple,
  },
  {
    step: 3,
    title: 'Stay Safe',
    description: 'Remove any means of self-harm and stay with someone you trust until help arrives.',
    icon: Heart,
    color: Colors.green,
  },
  {
    step: 4,
    title: 'Follow Up',
    description: 'Continue with professional support and create a safety plan for the future.',
    icon: Clock,
    color: Colors.yellow,
  },
];

export default function CrisisAlertScreen() {
  const [expandedResource, setExpandedResource] = useState<number | null>(null);

  const handleCall = (phone: string) => {
    const phoneNumber = phone.replace(/[^0-9]/g, '');
    Alert.alert(
      'Call Crisis Support',
      `Do you want to call ${phone}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Call Now',
          onPress: () => {
            Linking.openURL(`tel:${phoneNumber}`).catch(() => {
              Alert.alert('Error', 'Unable to make phone call. Please dial manually.');
            });
          },
        },
      ]
    );
  };

  const handleWebResource = (url: string) => {
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Unable to open website. Please check your internet connection.');
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={Colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Crisis Support</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Alert Banner */}
        <View style={styles.alertBanner}>
          <AlertTriangle size={24} color={Colors.error} />
          <View style={styles.alertContent}>
            <Text style={styles.alertTitle}>You Are Not Alone</Text>
            <Text style={styles.alertText}>
              If you're having thoughts of self-harm or suicide, please reach out for help immediately. 
              There are people who care and want to support you.
            </Text>
          </View>
        </View>

        {/* Emergency Call Button */}
        <TouchableOpacity 
          style={styles.emergencyButton}
          onPress={() => handleCall('911')}
        >
          <Phone size={24} color={Colors.white} />
          <Text style={styles.emergencyButtonText}>Call 911 - Emergency</Text>
        </TouchableOpacity>

        {/* Crisis Resources */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Crisis Support Resources</Text>
          {crisisResources.map((resource) => (
            <View key={resource.id} style={styles.resourceCard}>
              <TouchableOpacity
                style={styles.resourceHeader}
                onPress={() => setExpandedResource(
                  expandedResource === resource.id ? null : resource.id
                )}
              >
                <View style={styles.resourceIcon}>
                  <resource.icon size={20} color={resource.color} />
                </View>
                <View style={styles.resourceInfo}>
                  <Text style={styles.resourceTitle}>{resource.title}</Text>
                  <Text style={styles.resourceSubtitle}>{resource.subtitle}</Text>
                  {resource.urgent && (
                    <View style={styles.urgentBadge}>
                      <Text style={styles.urgentText}>24/7 Available</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>

              {expandedResource === resource.id && (
                <View style={styles.resourceDetails}>
                  <Text style={styles.resourceDescription}>{resource.description}</Text>
                  <TouchableOpacity
                    style={[styles.callButton, { backgroundColor: resource.color }]}
                    onPress={() => handleCall(resource.phone)}
                  >
                    <Phone size={16} color={Colors.white} />
                    <Text style={styles.callButtonText}>Call {resource.phone}</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Emergency Steps */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What to Do in a Crisis</Text>
          {emergencySteps.map((step) => (
            <View key={step.step} style={styles.stepCard}>
              <View style={[styles.stepNumber, { backgroundColor: step.color }]}>
                <Text style={styles.stepNumberText}>{step.step}</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>{step.title}</Text>
                <Text style={styles.stepDescription}>{step.description}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Additional Resources */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Additional Support</Text>
          
          <TouchableOpacity 
            style={styles.webResourceCard}
            onPress={() => handleWebResource('https://suicidepreventionlifeline.org')}
          >
            <Globe size={20} color={Colors.purple} />
            <View style={styles.webResourceContent}>
              <Text style={styles.webResourceTitle}>Suicide Prevention Lifeline</Text>
              <Text style={styles.webResourceUrl}>suicidepreventionlifeline.org</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.webResourceCard}
            onPress={() => handleWebResource('https://www.nami.org')}
          >
            <Globe size={20} color={Colors.green} />
            <View style={styles.webResourceContent}>
              <Text style={styles.webResourceTitle}>National Alliance on Mental Illness</Text>
              <Text style={styles.webResourceUrl}>nami.org</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Safety Message */}
        <View style={styles.safetyCard}>
          <Heart size={24} color={Colors.pink} />
          <Text style={styles.safetyTitle}>Remember</Text>
          <Text style={styles.safetyText}>
            Your life has value and meaning. Crisis feelings are temporary, but suicide is permanent. 
            Help is available, and recovery is possible. You deserve support and care.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray100,
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
  },
  alertBanner: {
    flexDirection: 'row',
    backgroundColor: Colors.error + '10',
    marginHorizontal: Spacing.xl,
    marginVertical: Spacing.lg,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderLeftWidth: 4,
    borderLeftColor: Colors.error,
  },
  alertContent: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  alertTitle: {
    ...Typography.paragraph,
    color: Colors.error,
    fontFamily: 'Indivisible-Bold',
    marginBottom: Spacing.sm,
  },
  alertText: {
    ...Typography.secondary,
    color: Colors.gray700,
    lineHeight: 20,
  },
  emergencyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.error,
    marginHorizontal: Spacing.xl,
    marginBottom: Spacing.xl,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.md,
    ...Shadow.large,
  },
  emergencyButtonText: {
    ...Typography.paragraph,
    color: Colors.white,
    fontFamily: 'Indivisible-Bold',
    marginLeft: Spacing.sm,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    ...Typography.heading,
    color: Colors.black,
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  resourceCard: {
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.xl,
    marginBottom: Spacing.md,
    borderRadius: BorderRadius.md,
    ...Shadow.small,
  },
  resourceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  resourceIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.gray100,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  resourceInfo: {
    flex: 1,
  },
  resourceTitle: {
    ...Typography.paragraph,
    color: Colors.black,
    fontFamily: 'Indivisible-Bold',
    marginBottom: Spacing.xs,
  },
  resourceSubtitle: {
    ...Typography.secondary,
    color: Colors.gray600,
    marginBottom: Spacing.xs,
  },
  urgentBadge: {
    backgroundColor: Colors.error + '20',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    alignSelf: 'flex-start',
  },
  urgentText: {
    ...Typography.small,
    color: Colors.error,
    fontFamily: 'Indivisible-Bold',
  },
  resourceDetails: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.gray200,
  },
  resourceDescription: {
    ...Typography.secondary,
    color: Colors.gray700,
    lineHeight: 20,
    marginBottom: Spacing.lg,
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.sm,
  },
  callButtonText: {
    ...Typography.secondary,
    color: Colors.white,
    fontFamily: 'Indivisible-Bold',
    marginLeft: Spacing.sm,
  },
  stepCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.xl,
    marginBottom: Spacing.md,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    ...Shadow.small,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  stepNumberText: {
    ...Typography.secondary,
    color: Colors.white,
    fontFamily: 'Indivisible-Bold',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    ...Typography.paragraph,
    color: Colors.black,
    fontFamily: 'Indivisible-Bold',
    marginBottom: Spacing.sm,
  },
  stepDescription: {
    ...Typography.secondary,
    color: Colors.gray600,
    lineHeight: 20,
  },
  webResourceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.xl,
    marginBottom: Spacing.md,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    ...Shadow.small,
  },
  webResourceContent: {
    marginLeft: Spacing.md,
  },
  webResourceTitle: {
    ...Typography.secondary,
    color: Colors.black,
    fontFamily: 'Indivisible-Bold',
    marginBottom: Spacing.xs,
  },
  webResourceUrl: {
    ...Typography.small,
    color: Colors.purple,
  },
  safetyCard: {
    backgroundColor: Colors.pink + '10',
    marginHorizontal: Spacing.xl,
    marginBottom: Spacing.xxl,
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.pink + '30',
  },
  safetyTitle: {
    ...Typography.heading,
    color: Colors.black,
    marginVertical: Spacing.md,
  },
  safetyText: {
    ...Typography.secondary,
    color: Colors.gray700,
    textAlign: 'center',
    lineHeight: 22,
  },
});