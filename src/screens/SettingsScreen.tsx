import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Switch,
  ActivityIndicator,
  Modal,
  Alert,
} from 'react-native';
import { Icon } from '../components/ui/Icon';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../i18n';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../hooks/useAuth';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../types/navigation';

const APP_VERSION = '0.0.1';

export function SettingsScreen() {
  const { theme, colors, toggleTheme } = useTheme();
  const { t, language, setLanguage } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const { logout, user, resetPassword, deleteAccount } = useAuth();
  
  const onBack = () => navigation.goBack();

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const onLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    setIsLoggingOut(false);
  };

  const [isResetting, setIsResetting] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const handleResetPassword = async () => {
    if (!user?.email) return;
    setIsResetting(true);
    const { success } = await resetPassword(user.email);
    setIsResetting(false);
    if (success) {
      setResetSent(true);
      setTimeout(() => setResetSent(false), 5000);
    }
  };

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    const { success, error } = await deleteAccount();
    setIsDeleting(false);
    setShowDeleteModal(false);
    if (!success) {
      Alert.alert('Error', error || 'Failed to delete account');
    }
  };
  
  const isDark = theme === 'dark';
  const [pushEnabled, setPushEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Icon name="arrow-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.textPrimary }]}>{t('settings_title')}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Appearance */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>{t('settings_appearance')}</Text>
          <View style={[styles.card, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.iconContainer, { backgroundColor: colors.secondary }]}>
                  <Icon name="moon" size={20} color="#E5E7EB" />
                </View>
                <Text style={[styles.settingText, { color: colors.textPrimary }]}>{t('settings_dark_mode')}</Text>
              </View>
              <Switch
                value={isDark}
                onValueChange={toggleTheme}
                trackColor={{ false: colors.textMuted, true: colors.secondary }}
                thumbColor="#E5E7EB"
                ios_backgroundColor={isDark ? colors.textMuted : colors.textSecondary}
              />
            </View>

            <View style={[styles.divider, { backgroundColor: colors.divider }]} />

            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.iconContainer, { backgroundColor: colors.warning }]}>
                  <Icon name="language" size={20} color="#E5E7EB" />
                </View>
                <Text style={[styles.settingText, { color: colors.textPrimary }]}>{t('settings_language')}</Text>
              </View>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <TouchableOpacity
                  style={{
                    backgroundColor: language === 'fr' ? colors.primary : colors.cardBorder,
                    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12
                  }}
                  onPress={() => setLanguage('fr')}
                >
                  <Text style={{ color: language === 'fr' ? '#FFFFFF' : colors.textSecondary, fontSize: 12, fontWeight: 'bold' }}>Français</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    backgroundColor: language === 'en' ? colors.primary : colors.cardBorder,
                    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12
                  }}
                  onPress={() => setLanguage('en')}
                >
                  <Text style={{ color: language === 'en' ? '#FFFFFF' : colors.textSecondary, fontSize: 12, fontWeight: 'bold' }}>English</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Notifications */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>{t('settings_notifications')}</Text>
          <View style={[styles.card, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.iconContainer, { backgroundColor: colors.primary }]}>
                  <Icon name="bell" size={20} color="#E5E7EB" />
                </View>
                <Text style={[styles.settingText, { color: colors.textPrimary }]}>{t('settings_push')}</Text>
              </View>
              <Switch
                value={pushEnabled}
                onValueChange={setPushEnabled}
                trackColor={{ false: colors.textMuted, true: colors.primary }}
                thumbColor="#E5E7EB"
                ios_backgroundColor={isDark ? colors.textMuted : colors.textSecondary}
              />
            </View>

            <View style={[styles.divider, { backgroundColor: colors.divider }]} />

            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.iconContainer, { backgroundColor: colors.success }]}>
                  <Icon name="volume-up" size={20} color="#E5E7EB" />
                </View>
                <Text style={[styles.settingText, { color: colors.textPrimary }]}>{t('settings_sounds')}</Text>
              </View>
              <Switch
                value={soundEnabled}
                onValueChange={setSoundEnabled}
                trackColor={{ false: colors.textMuted, true: colors.success }}
                thumbColor="#E5E7EB"
                ios_backgroundColor={isDark ? colors.textMuted : colors.textSecondary}
              />
            </View>
          </View>
        </View>

        {/* Account Management */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>{t('settings_account')}</Text>
          <View style={[styles.card, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
            <TouchableOpacity style={styles.settingItem} onPress={() => navigation.navigate('EditProfile')}>
              <View style={styles.settingLeft}>
                <View style={[styles.iconContainer, { backgroundColor: colors.info }]}>
                  <Icon name="user" size={20} color="#E5E7EB" />
                </View>
                <Text style={[styles.settingText, { color: colors.textPrimary }]}>{t('settings_edit_profile')}</Text>
              </View>
              <Text style={[styles.chevron, { color: colors.textTertiary }]}>›</Text>
            </TouchableOpacity>

            <View style={[styles.divider, { backgroundColor: colors.divider }]} />

            <View style={styles.passwordSection}>
              <View style={styles.settingItem}>
                <View style={styles.settingLeft}>
                  <View style={[styles.iconContainer, { backgroundColor: colors.warning }]}>
                    <Icon name="lock" size={20} color="#E5E7EB" />
                  </View>
                  <Text style={[styles.settingText, { color: colors.textPrimary }]}>{t('settings_change_password')}</Text>
                </View>
              </View>
              <View style={styles.actionBlock}>
                <TouchableOpacity 
                   style={[styles.actionBtnRow, { backgroundColor: colors.cardBorder }]}
                   onPress={handleResetPassword}
                   disabled={isResetting || resetSent}
                >
                  <Text style={[styles.actionBtnText, { color: colors.textPrimary }]}>
                    {isResetting ? t('loading_text') : resetSent ? t('settings_reset_password_sent') : t('settings_reset_password_btn')}
                  </Text>
                  {isResetting && <ActivityIndicator size="small" color={colors.textPrimary} style={{marginLeft: 8}} />}
                  {resetSent && <Icon name="checkmark-circle" size={16} color="#4ADE80" style={{marginLeft: 8}} />}
                </TouchableOpacity>
              </View>
            </View>

            <View style={[styles.divider, { backgroundColor: colors.divider }]} />

            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.iconContainer, { backgroundColor: '#64748B' }]}>
                  <Icon name="help" size={20} color="#E5E7EB" />
                </View>
                <Text style={[styles.settingText, { color: colors.textPrimary }]}>{t('settings_help')}</Text>
              </View>
              <Text style={[styles.chevron, { color: colors.textTertiary }]}>›</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: '#F87171' }]}>{t('settings_delete_account')}</Text>
          <View style={[styles.card, { backgroundColor: colors.cardBackground, borderColor: '#F87171', borderStyle: 'dashed' }]}>
             <TouchableOpacity 
                style={styles.settingItem} 
                onPress={() => setShowDeleteModal(true)}
             >
                <View style={styles.settingLeft}>
                  <View style={[styles.iconContainer, { backgroundColor: 'rgba(248, 113, 113, 0.1)' }]}>
                    <Icon name="trash" size={20} color="#F87171" />
                  </View>
                  <Text style={[styles.settingText, { color: '#F87171' }]}>{t('settings_delete_btn')}</Text>
                </View>
             </TouchableOpacity>
          </View>
        </View>

        {/* Logout */}
        <View style={styles.section}>
          <TouchableOpacity
            style={[styles.logoutButton, { backgroundColor: 'rgba(248, 113, 113, 0.1)', borderColor: 'rgba(248, 113, 113, 0.2)', opacity: isLoggingOut ? 0.6 : 1 }]}
            onPress={onLogout}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? (
              <ActivityIndicator size="small" color="#F87171" />
            ) : (
              <>
                <Icon name="logout" size={20} color="#F87171" />
                <Text style={styles.logoutText}>{t('settings_logout')}</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.appInfoSection}>
            <Text style={[styles.versionText, { color: colors.textTertiary }]}>Mahara v{APP_VERSION}</Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Delete Confirmation Modal */}
      <Modal
        visible={showDeleteModal}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
            <Icon name="alert-circle" size={48} color="#F87171" style={{marginBottom: 16}} />
            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>{t('settings_delete_confirm_title')}</Text>
            <Text style={[styles.modalMessage, { color: colors.textSecondary }]}>{t('settings_delete_confirm_msg')}</Text>
            
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={[styles.modalBtn, { backgroundColor: colors.cardBorder }]}
                onPress={() => setShowDeleteModal(false)}
                disabled={isDeleting}
              >
                <Text style={[styles.modalBtnText, { color: colors.textPrimary }]}>{t('settings_delete_cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalBtn, { backgroundColor: '#F87171' }]}
                onPress={handleDeleteAccount}
                disabled={isDeleting}
              >
                {isDeleting ? <ActivityIndicator size="small" color="#FFFFFF" /> : <Text style={[styles.modalBtnText, { color: '#FFFFFF' }]}>{t('settings_delete_confirm')}</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 40,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingText: {
    fontSize: 15,
    fontWeight: '600',
  },
  chevron: {
    fontSize: 24,
  },
  versionText: {
    fontSize: 12,
    textAlign: 'center',
  },
  divider: {
    height: 1,
    marginHorizontal: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#F87171',
  },
  passwordSection: {
    paddingBottom: 12,
  },
  actionBlock: {
    paddingHorizontal: 16,
    paddingBottom: 4,
  },
  actionBtnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
  appInfoSection: {
    marginTop: 40,
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    width: '100%',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
  },
  modalBtnText: {
    fontSize: 15,
    fontWeight: 'bold',
  },
});
