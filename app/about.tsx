import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  ArrowLeft,
  Heart,
  Shield,
  Users,
  Mail,
  Globe,
  FileText,
  Award,
  Lightbulb,
} from 'lucide-react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadow } from '@/constants/theme';

const teamMembers = [
  { name: 'Dr. Sarah Chen', role: 'Clinical Psychologist', specialty: 'Mental Health Research' },
  { name: 'Alex Rodriguez', role: 'AI Engineer', specialty: 'Natural Language Processing' },
  { name: 'Maya Patel', role: 'UX Designer', specialty: 'Accessibility & Wellness Design' },
  { name: 'Dr. James Wilson', role: 'Psychiatrist', specialty: 'Crisis Intervention' },
];

const features = [
  {
    icon: Heart,
    title: 'Mood Tracking',
    description: 'Advanced sentiment analysis to understand your emotional patterns',
  },
  {
    icon: Shield,
    title: 'Privacy First',
    description: 'Your data is encrypted and never shared without your consent',
  },
  {
    icon: Users,
    title: 'Expert Backed',
    description: 'Developed with licensed mental health professionals',
  },
  {
    icon: Lightbulb,
    title: 'AI Powered',
    description: 'Personalized insights and recommendations based on your needs',
  },
];

export default function AboutAppScreen() {
  const handleLinkPress = (url: string) => {
    Linking.openURL(url).catch(() => {
      console.log('Unable to open URL');
    });
  };

  const handleEmailPress = () => {
    Linking.openURL('mailto:support@mediverse.app').catch(() => {
      console.log('Unable to open email client');
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={Colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About Mediverse</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* App Logo & Mission */}
        <View style={styles.heroSection}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoEmoji}>🧠</Text>
          </View>
          <Text style={styles.appName}>Mediverse</Text>
          <Text style={styles.tagline}>Mental Health Companion</Text>
          <Text style={styles.missionText}>
            Empowering individuals to understand, track, and improve their mental wellness 
            through AI-powered insights and evidence-based interventions.
          </Text>
        </View>

        {/* Key Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Features</Text>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureCard}>
              <View style={[styles.featureIcon, { backgroundColor: Colors.purple + '20' }]}>
                <feature.icon size={24} color={Colors.purple} />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Our Team */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Team</Text>
          <View style={styles.teamContainer}>
            {teamMembers.map((member, index) => (
              <View key={index} style={styles.teamMember}>
                <View style={styles.memberAvatar}>
                  <Users size={20} color={Colors.white} />
                </View>
                <View style={styles.memberInfo}>
                  <Text style={styles.memberName}>{member.name}</Text>
                  <Text style={styles.memberRole}>{member.role}</Text>
                  <Text style={styles.memberSpecialty}>{member.specialty}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Mental Health Disclaimer */}
        <View style={styles.disclaimerCard}>
          <Shield size={24} color={Colors.warning} />
          <Text style={styles.disclaimerTitle}>Important Disclaimer</Text>
          <Text style={styles.disclaimerText}>
            Mediverse is designed to support your mental wellness journey but is not a substitute 
            for professional medical advice, diagnosis, or treatment. If you're experiencing a 
            mental health crisis, please contact emergency services or a mental health professional immediately.
          </Text>
        </View>

        {/* Privacy & Security */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy & Security</Text>
          <View style={styles.privacyCard}>
            <Text style={styles.privacyText}>
              Your mental health data is sensitive and personal. We use end-to-end encryption 
              to protect your information and never sell your data to third parties. All AI 
              processing happens securely, and you maintain full control over your data.
            </Text>
            
            <View style={styles.privacyLinks}>
              <TouchableOpacity 
                style={styles.linkButton}
                onPress={() => handleLinkPress('https://mediverse.app/privacy')}
              >
                <FileText size={16} color={Colors.purple} />
                <Text style={styles.linkText}>Privacy Policy</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.linkButton}
                onPress={() => handleLinkPress('https://mediverse.app/terms')}
              >
                <FileText size={16} color={Colors.purple} />
                <Text style={styles.linkText}>Terms of Service</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Contact & Support */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact & Support</Text>
          <View style={styles.contactCard}>
            <TouchableOpacity style={styles.contactItem} onPress={handleEmailPress}>
              <Mail size={20} color={Colors.purple} />
              <Text style={styles.contactText}>support@mediverse.app</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.contactItem}
              onPress={() => handleLinkPress('https://mediverse.app')}
            >
              <Globe size={20} color={Colors.purple} />
              <Text style={styles.contactText}>mediverse.app</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Acknowledgments */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acknowledgments</Text>
          <View style={styles.acknowledgementsCard}>
            <Award size={24} color={Colors.yellow} />
            <Text style={styles.acknowledgementsTitle}>Special Thanks</Text>
            <Text style={styles.acknowledgementsText}>
              We're grateful to the mental health professionals, researchers, and individuals 
              who shared their experiences to help us build a more effective and compassionate 
              mental health companion. This app is built on evidence-based practices and 
              validated therapeutic approaches.
            </Text>
          </View>
        </View>

        {/* Version Info */}
        <View style={styles.versionCard}>
          <Text style={styles.versionTitle}>Version 1.0.0</Text>
          <Text style={styles.versionDate}>Released March 2024</Text>
          <Text style={styles.versionText}>
            Built with ❤️ for mental health awareness and support
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
  heroSection: {
    backgroundColor: Colors.white,
    alignItems: 'center',
    paddingVertical: Spacing.huge,
    marginBottom: Spacing.lg,
  },
  logoContainer: {
    width: 80,
    height: 80,
    backgroundColor: Colors.purple,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    ...Shadow.medium,
  },
  logoEmoji: {
    fontSize: 40,
  },
  appName: {
    ...Typography.title,
    color: Colors.black,
    marginBottom: Spacing.sm,
  },
  tagline: {
    ...Typography.secondary,
    color: Colors.purple,
    fontFamily: 'Indivisible-Bold',
    marginBottom: Spacing.lg,
  },
  missionText: {
    ...Typography.secondary,
    color: Colors.gray600,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: Spacing.xl,
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
  featureCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.xl,
    marginBottom: Spacing.md,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    ...Shadow.small,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    ...Typography.paragraph,
    color: Colors.black,
    fontFamily: 'Indivisible-Bold',
    marginBottom: Spacing.sm,
  },
  featureDescription: {
    ...Typography.secondary,
    color: Colors.gray600,
    lineHeight: 20,
  },
  teamContainer: {
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.xl,
    borderRadius: BorderRadius.md,
    ...Shadow.small,
  },
  teamMember: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.purple,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    ...Typography.paragraph,
    color: Colors.black,
    fontFamily: 'Indivisible-Bold',
    marginBottom: Spacing.xs,
  },
  memberRole: {
    ...Typography.secondary,
    color: Colors.purple,
    marginBottom: Spacing.xs,
  },
  memberSpecialty: {
    ...Typography.small,
    color: Colors.gray600,
  },
  disclaimerCard: {
    backgroundColor: Colors.warning + '10',
    marginHorizontal: Spacing.xl,
    marginBottom: Spacing.xl,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderLeftWidth: 4,
    borderLeftColor: Colors.warning,
    alignItems: 'center',
  },
  disclaimerTitle: {
    ...Typography.paragraph,
    color: Colors.warning,
    fontFamily: 'Indivisible-Bold',
    marginVertical: Spacing.md,
  },
  disclaimerText: {
    ...Typography.secondary,
    color: Colors.gray700,
    textAlign: 'center',
    lineHeight: 20,
  },
  privacyCard: {
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.xl,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    ...Shadow.small,
  },
  privacyText: {
    ...Typography.secondary,
    color: Colors.gray700,
    lineHeight: 20,
    marginBottom: Spacing.lg,
  },
  privacyLinks: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  linkText: {
    ...Typography.secondary,
    color: Colors.purple,
    marginLeft: Spacing.sm,
    fontFamily: 'Indivisible-Bold',
  },
  contactCard: {
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.xl,
    borderRadius: BorderRadius.md,
    ...Shadow.small,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  contactText: {
    ...Typography.paragraph,
    color: Colors.black,
    marginLeft: Spacing.md,
  },
  acknowledgementsCard: {
    backgroundColor: Colors.yellow + '10',
    marginHorizontal: Spacing.xl,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.yellow + '30',
  },
  acknowledgementsTitle: {
    ...Typography.paragraph,
    color: Colors.black,
    fontFamily: 'Indivisible-Bold',
    marginVertical: Spacing.md,
  },
  acknowledgementsText: {
    ...Typography.secondary,
    color: Colors.gray700,
    textAlign: 'center',
    lineHeight: 20,
  },
  versionCard: {
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.xl,
    marginBottom: Spacing.xxl,
    padding: Spacing.xl,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    ...Shadow.small,
  },
  versionTitle: {
    ...Typography.subtitle,
    color: Colors.black,
    marginBottom: Spacing.xs,
  },
  versionDate: {
    ...Typography.secondary,
    color: Colors.gray600,
    marginBottom: Spacing.md,
  },
  versionText: {
    ...Typography.small,
    color: Colors.gray600,
    textAlign: 'center',
  },
});