import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, Check, Crown, Sparkles, Heart, Brain, Music, Zap } from 'lucide-react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadow } from '@/constants/theme';

const plans = [
  {
    id: 'free',
    name: 'Mediverse Free',
    price: '$0',
    period: 'forever',
    description: 'Essential mental health tools',
    features: [
      'Basic mood tracking',
      'Daily affirmations',
      'Simple breathing exercises',
      'Limited AI chat (10 messages/day)',
      'Basic insights',
    ],
    limitations: [
      'Limited features',
      'Basic support',
      'Ads included',
    ],
    color: Colors.gray600,
    icon: Heart,
  },
  {
    id: 'pro',
    name: 'Mediverse Pro',
    price: '$9.99',
    period: 'month',
    description: 'Complete mental wellness companion',
    features: [
      'Unlimited mood tracking & insights',
      'Advanced AI companion chat',
      'Personalized meditation library',
      'Voice mood analysis',
      'Custom wellness plans',
      'Detailed progress reports',
      'Crisis support features',
      'Premium music & sounds',
      'Export your data',
      'Priority support',
    ],
    popular: true,
    color: Colors.lavender,
    icon: Crown,
  },
];

const benefits = [
  {
    icon: Brain,
    title: 'Advanced AI Insights',
    description: 'Get deeper understanding of your mental health patterns',
    color: Colors.lavender,
  },
  {
    icon: Music,
    title: 'Premium Content',
    description: 'Access to exclusive meditations, music, and exercises',
    color: Colors.softMint,
  },
  {
    icon: Zap,
    title: 'Unlimited Usage',
    description: 'No limits on tracking, chatting, or accessing features',
    color: Colors.yellow,
  },
  {
    icon: Sparkles,
    title: 'Personalized Experience',
    description: 'Custom recommendations based on your unique needs',
    color: Colors.pink,
  },
];

export default function SubscriptionScreen() {
  const [selectedPlan, setSelectedPlan] = useState('pro');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async () => {
    if (selectedPlan === 'free') {
      router.back();
      return;
    }

    setIsLoading(true);
    
    // Simulate subscription process
    setTimeout(() => {
      setIsLoading(false);
      // In a real app, this would integrate with RevenueCat
      router.back();
    }, 2000);
  };

  const PlanCard = ({ plan }: { plan: any }) => {
    const isSelected = selectedPlan === plan.id;
    const Icon = plan.icon;

    return (
      <TouchableOpacity
        style={[
          styles.planCard,
          isSelected && styles.selectedPlan,
          plan.popular && styles.popularPlan,
        ]}
        onPress={() => setSelectedPlan(plan.id)}
      >
        {plan.popular && (
          <View style={styles.popularBadge}>
            <Sparkles size={16} color={Colors.white} />
            <Text style={styles.popularText}>Most Popular</Text>
          </View>
        )}

        <View style={styles.planHeader}>
          <View style={[styles.planIcon, { backgroundColor: plan.color + '20' }]}>
            <Icon size={24} color={plan.color} />
          </View>
          <View style={styles.planInfo}>
            <Text style={styles.planName}>{plan.name}</Text>
            <Text style={styles.planDescription}>{plan.description}</Text>
          </View>
          {isSelected && (
            <View style={styles.selectedIndicator}>
              <Check size={16} color={Colors.white} />
            </View>
          )}
        </View>

        <View style={styles.planPricing}>
          <Text style={styles.planPrice}>{plan.price}</Text>
          <Text style={styles.planPeriod}>/{plan.period}</Text>
        </View>

        <View style={styles.planFeatures}>
          {plan.features.map((feature: string, index: number) => (
            <View key={index} style={styles.featureItem}>
              <Check size={16} color={Colors.green} />
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>

        {plan.limitations && (
          <View style={styles.planLimitations}>
            <Text style={styles.limitationsTitle}>Limitations:</Text>
            {plan.limitations.map((limitation: string, index: number) => (
              <Text key={index} style={styles.limitationText}>
                • {limitation}
              </Text>
            ))}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={Colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Choose Your Plan</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroSection}>
          <Crown size={48} color={Colors.lavender} />
          <Text style={styles.heroTitle}>Unlock Your Full Potential</Text>
          <Text style={styles.heroSubtitle}>
            Get unlimited access to all mental health tools and personalized insights
          </Text>
        </View>

        {/* Benefits */}
        <View style={styles.benefitsSection}>
          <Text style={styles.sectionTitle}>Why Upgrade to Pro?</Text>
          {benefits.map((benefit, index) => (
            <View key={index} style={styles.benefitItem}>
              <View style={[styles.benefitIcon, { backgroundColor: benefit.color + '20' }]}>
                <benefit.icon size={20} color={benefit.color} />
              </View>
              <View style={styles.benefitContent}>
                <Text style={styles.benefitTitle}>{benefit.title}</Text>
                <Text style={styles.benefitDescription}>{benefit.description}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Plans */}
        <View style={styles.plansSection}>
          <Text style={styles.sectionTitle}>Choose Your Plan</Text>
          {plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </View>

        {/* Subscribe Button */}
        <TouchableOpacity 
          style={[styles.subscribeButton, isLoading && styles.loadingButton]} 
          onPress={handleSubscribe}
          disabled={isLoading}
        >
          <Text style={styles.subscribeButtonText}>
            {isLoading 
              ? 'Processing...' 
              : selectedPlan === 'free' 
                ? 'Continue with Free' 
                : 'Start Pro Trial'
            }
          </Text>
        </TouchableOpacity>

        {/* Terms */}
        <View style={styles.termsSection}>
          <Text style={styles.termsText}>
            7-day free trial, then $9.99/month. Cancel anytime.{'\n'}
            By subscribing, you agree to our Terms of Service and Privacy Policy.
          </Text>
        </View>

        {/* Trust Indicators */}
        <View style={styles.trustSection}>
          <View style={styles.trustItem}>
            <Text style={styles.trustTitle}>🔒 Secure Payments</Text>
            <Text style={styles.trustDescription}>Your payment info is encrypted and secure</Text>
          </View>
          <View style={styles.trustItem}>
            <Text style={styles.trustTitle}>❌ Cancel Anytime</Text>
            <Text style={styles.trustDescription}>No commitments, cancel with one tap</Text>
          </View>
          <View style={styles.trustItem}>
            <Text style={styles.trustTitle}>📱 All Devices</Text>
            <Text style={styles.trustDescription}>Access on phone, tablet, and web</Text>
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
  heroSection: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.huge,
    alignItems: 'center',
    marginTop: Spacing.xl,
    marginBottom: Spacing.xl,
    ...Shadow.medium,
  },
  heroTitle: {
    ...Typography.subtitle,
    color: Colors.black,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  heroSubtitle: {
    ...Typography.secondary,
    color: Colors.gray600,
    textAlign: 'center',
    lineHeight: 20,
  },
  benefitsSection: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    ...Typography.heading,
    color: Colors.black,
    marginBottom: Spacing.lg,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadow.small,
  },
  benefitIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  benefitContent: {
    flex: 1,
  },
  benefitTitle: {
    ...Typography.paragraph,
    color: Colors.black,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: Spacing.xs,
  },
  benefitDescription: {
    ...Typography.secondary,
    color: Colors.gray600,
    lineHeight: 18,
  },
  plansSection: {
    marginBottom: Spacing.xl,
  },
  planCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    borderWidth: 2,
    borderColor: Colors.gray200,
    position: 'relative',
    ...Shadow.small,
  },
  selectedPlan: {
    borderColor: Colors.lavender,
    backgroundColor: Colors.lightLavender,
  },
  popularPlan: {
    borderColor: Colors.lavender,
  },
  popularBadge: {
    position: 'absolute',
    top: -12,
    left: Spacing.lg,
    backgroundColor: Colors.lavender,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.xl,
    ...Shadow.medium,
  },
  popularText: {
    ...Typography.small,
    color: Colors.white,
    marginLeft: Spacing.xs,
    fontFamily: 'Poppins-SemiBold',
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  planIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  planInfo: {
    flex: 1,
  },
  planName: {
    ...Typography.paragraph,
    color: Colors.black,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: Spacing.xs,
  },
  planDescription: {
    ...Typography.secondary,
    color: Colors.gray600,
  },
  selectedIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.lavender,
    justifyContent: 'center',
    alignItems: 'center',
  },
  planPricing: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: Spacing.lg,
  },
  planPrice: {
    ...Typography.title,
    color: Colors.black,
    fontFamily: 'Poppins-Bold',
  },
  planPeriod: {
    ...Typography.secondary,
    color: Colors.gray600,
  },
  planFeatures: {
    marginBottom: Spacing.lg,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  featureText: {
    ...Typography.secondary,
    color: Colors.gray700,
    marginLeft: Spacing.sm,
    flex: 1,
  },
  planLimitations: {
    backgroundColor: Colors.gray100,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
  },
  limitationsTitle: {
    ...Typography.small,
    color: Colors.gray600,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: Spacing.sm,
  },
  limitationText: {
    ...Typography.small,
    color: Colors.gray600,
    marginBottom: Spacing.xs,
  },
  subscribeButton: {
    backgroundColor: Colors.lavender,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    marginBottom: Spacing.lg,
    ...Shadow.medium,
  },
  loadingButton: {
    opacity: 0.7,
  },
  subscribeButtonText: {
    ...Typography.paragraph,
    color: Colors.white,
    fontFamily: 'Poppins-SemiBold',
  },
  termsSection: {
    marginBottom: Spacing.xl,
  },
  termsText: {
    ...Typography.small,
    color: Colors.gray600,
    textAlign: 'center',
    lineHeight: 18,
  },
  trustSection: {
    marginBottom: Spacing.huge,
  },
  trustItem: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadow.small,
  },
  trustTitle: {
    ...Typography.secondary,
    color: Colors.black,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: Spacing.sm,
  },
  trustDescription: {
    ...Typography.small,
    color: Colors.gray600,
    lineHeight: 18,
  },
});