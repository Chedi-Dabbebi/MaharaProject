import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Platform } from 'react-native';
import { Icon } from './ui/Icon';
import { XPBadge } from './ui/XPBadge';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../i18n';

interface TaskItemProps {
  title: string;
  duration: string;
  xp: number;
  completed: boolean;
  prompt?: string;
  items?: string[];
  onToggle: () => void;
}

export function TaskItem({ title, duration, xp, completed, prompt, items, onToggle }: TaskItemProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  
  const [isExpanded, setIsExpanded] = useState(false);
  const durationMinutes = parseInt(duration, 10) || 0;
  const totalSeconds = durationMinutes * 60;
  const [timeLeft, setTimeLeft] = useState(totalSeconds);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isRunning && timeLeft > 0 && !completed) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            if (!completed) onToggle(); // Auto-complete
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, completed, onToggle]);

  useEffect(() => {
    if (completed) {
      setIsRunning(false);
    }
  }, [completed]);

  const toggleExpand = () => setIsExpanded(!isExpanded);
  const toggleTimer = () => setIsRunning(!isRunning);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleYoutube = () => {
    const query = encodeURIComponent(title);
    Linking.openURL(`https://www.youtube.com/results?search_query=${query}`);
  };

  const hasContent = prompt || (items && items.length > 0);

  return (
    <View style={[styles.outerContainer, completed && styles.completed]}>
      <TouchableOpacity
        style={[
          styles.container,
          { backgroundColor: colors.surfaceElevated, borderColor: colors.border },
          isExpanded && styles.containerExpanded
        ]}
        onPress={toggleExpand}
        activeOpacity={0.8}
      >
        {/* Block 1 — Task header card */}
        <View style={styles.headerRow}>
          <View style={styles.headerContent}>
            <Text
              style={[
                styles.title,
                { color: completed ? colors.textMuted : colors.textPrimary },
                completed && styles.titleCompleted,
              ]}
              numberOfLines={2}
            >
              {title}
            </Text>
            <View style={styles.durationContainer}>
              <Icon name="time" size={12} color={colors.textSecondary} />
              <Text style={[styles.duration, { color: colors.textSecondary }]}>{duration}</Text>
            </View>
          </View>
          <XPBadge xp={xp} active={!completed} />
        </View>

        {/* Expanded Content */}
        {isExpanded && (
          <View style={styles.expandedContent}>
            
            {/* Block 2: Session controls row */}
            <View style={styles.controlsRow}>
              <View style={[styles.controlsBar, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <Text style={[
                  styles.timerText, 
                  { color: (timeLeft <= totalSeconds * 0.3 && !completed) ? '#EF4444' : colors.textPrimary }
                ]}>
                  {formatTime(timeLeft)}
                </Text>
                
                <View style={styles.controlsActions}>
                  <TouchableOpacity onPress={toggleTimer} style={styles.iconButton}>
                    {isRunning ? (
                      <Icon name="pause" size={24} color={colors.primary} />
                    ) : (
                      <Icon name="play" size={24} color={colors.primary} />
                    )}
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    onPress={onToggle} 
                    style={[styles.iconButton, completed && { backgroundColor: 'rgba(16, 185, 129, 0.15)', borderRadius: 20 }]}
                  >
                    <Icon 
                      name={completed ? "checkmark-circle" : "checkmark"} 
                      size={24} 
                      color={completed ? "#10B981" : colors.textMuted} 
                    />
                  </TouchableOpacity>
                </View>
              </View>
              
              <TouchableOpacity 
                style={styles.youtubeBtn} 
                onPress={handleYoutube}
              >
                <Icon name="play-circle" size={32} color={colors.primary} />
              </TouchableOpacity>
            </View>

            {/* Block 3: Content card */}
            <View style={[styles.contentCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              
              {!hasContent ? (
                <View style={styles.section}>
                  <Text style={[styles.fallbackText, { color: colors.textSecondary }]}>
                    Contenu non disponible pour cette tâche
                  </Text>
                </View>
              ) : (
                <>
                  {prompt && (
                    <View style={styles.section}>
                      <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>DESCRIPTION</Text>
                      <Text style={[styles.promptText, { color: colors.textPrimary }]}>{prompt}</Text>
                    </View>
                  )}
                  
                  {items && items.length > 0 && (
                    <View style={[
                      styles.section, 
                      prompt ? { borderTopWidth: 1, borderTopColor: colors.border } : {}
                    ]}>
                      <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>À FAIRE</Text>
                      <View style={styles.itemsList}>
                        {items.map((item, index) => (
                          <View key={index} style={styles.itemRow}>
                            <View style={[styles.badge, { backgroundColor: colors.primary + '20' }]}>
                              <Text style={[styles.badgeText, { color: colors.primary }]}>
                                {index + 1}
                              </Text>
                            </View>
                            <Text style={[styles.itemText, { color: colors.textPrimary }]}>{item}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  )}
                </>
              )}
              
              {completed && (
                <View style={[
                  styles.section, 
                  styles.checkboxSection, 
                  hasContent ? { borderTopWidth: 1, borderTopColor: colors.border } : {}
                ]}>
                  <TouchableOpacity style={styles.checkboxRow} onPress={onToggle} activeOpacity={0.7}>
                    <View
                      style={[
                        styles.checkbox,
                        {
                          backgroundColor: colors.secondary,
                          borderColor: colors.secondary,
                        }
                      ]}
                    >
                      <Icon name="checkmark" size={14} color="#FFFFFF" />
                    </View>
                    <Text style={[styles.checkboxLabel, { color: '#10B981', fontWeight: 'bold' }]}>
                      Terminé
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

            </View>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    marginBottom: 0,
  },
  completed: {
    opacity: 0.6,
  },
  container: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
  },
  containerExpanded: {
    paddingBottom: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerContent: {
    flex: 1,
    paddingRight: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  duration: {
    fontSize: 13,
  },
  expandedContent: {
    marginTop: 20,
  },
  controlsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
    height: 52,
  },
  controlsBar: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 16,
    paddingRight: 8,
  },
  timerText: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontVariant: ['tabular-nums'],
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  controlsActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 0,
  },
  iconButton: {
    padding: 8,
  },

  youtubeBtn: {
    width: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentCard: {
    borderWidth: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  promptText: {
    fontSize: 14,
    lineHeight: 20,
  },
  itemsList: {
    gap: 12,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  badge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 0,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  itemText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  checkboxSection: {
    paddingVertical: 12,
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  fallbackText: {
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 8,
  },
});
