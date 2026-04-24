// @ts-nocheck
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Icon } from './ui/Icon';
import type { LearningContent } from '../types';

interface LessonViewerProps {
  content: LearningContent;
  onComplete: () => void;
  onExit: () => void;
}

export function LessonViewer({ content, onComplete, onExit }: LessonViewerProps) {
  const { colors } = useTheme();

  function openLink() {
    if (content.resourceUrl || content.videoUrl) {
      const url = content.resourceUrl || content.videoUrl;
      Linking.openURL(url);
    }
  }

  function renderContentBody() {
    if (!content.contentBody) {
      return null;
    }

    // Simple markdown-like rendering
    const lines = content.contentBody.split('\n');

    return (
      <View style={styles.contentBody}>
        {lines.map((line, index) => {
          // Headers
          if (line.startsWith('# ')) {
            return (
              <Text key={index} style={[styles.header1, { color: colors.text }]}>
                {line.replace('# ', '')}
              </Text>
            );
          }

          if (line.startsWith('## ')) {
            return (
              <Text
                key={index}
                style={[styles.header2, { color: colors.text, marginTop: 20 }]}
              >
                {line.replace('## ', '')}
              </Text>
            );
          }

          if (line.startsWith('### ')) {
            return (
              <Text
                key={index}
                style={[styles.header3, { color: colors.text, marginTop: 16 }]}
              >
                {line.replace('### ', '')}
              </Text>
            );
          }

          // List items
          if (line.startsWith('- ') || line.startsWith('1. ') || line.startsWith('2. ') || line.startsWith('3. ')) {
            return (
              <Text key={index} style={[styles.listItem, { color: colors.text }]}>
                {line}
              </Text>
            );
          }

          // Table rows (simple display)
          if (line.includes('|') && line.trim().startsWith('|')) {
            const cells = line.split('|').filter(c => c.trim());
            return (
              <View key={index} style={styles.tableRow}>
                {cells.map((cell, cellIndex) => (
                  <Text
                    key={cellIndex}
                    style={[
                      styles.tableCell,
                      {
                        color: colors.text,
                        borderColor: colors.border,
                      },
                    ]}
                  >
                    {cell.trim()}
                  </Text>
                ))}
              </View>
            );
          }

          // Skip table separator lines
          if (line.trim().match(/^[\s|-]+$/)) {
            return null;
          }

          // Empty lines
          if (line.trim() === '') {
            return <View key={index} style={styles.spacing} />;
          }

          // Regular paragraph
          return (
            <Text key={index} style={[styles.paragraph, { color: colors.text }]}>
              {line}
            </Text>
          );
        })}
      </View>
    );
  }

  function renderContentTypeInfo() {
    const typeConfig = {
      lesson: { icon: 'menu-book', label: 'Leçon', color: colors.primary },
      exercise: { icon: 'fitness-center', label: 'Exercice', color: colors.success },
      quiz: { icon: 'quiz', label: 'Quiz', color: colors.warning },
      resource: { icon: 'link', label: 'Ressource', color: colors.info },
    };

    const config = typeConfig[content.contentType];

    return (
      <View style={[styles.typeBadge, { backgroundColor: config.color + '20' }]}>
        <Icon name={config.icon} size={16} color={config.color} />
        <Text style={[styles.typeText, { color: config.color }]}>{config.label}</Text>
      </View>
    );
  }

  function renderExternalResource() {
    if (!content.resourceUrl && !content.videoUrl) {
      return null;
    }

    const isVideo = !!content.videoUrl;

    return (
      <TouchableOpacity
        style={[styles.resourceLink, { backgroundColor: colors.cardBackground }]}
        onPress={openLink}
      >
        <View style={[styles.resourceIcon, { backgroundColor: colors.primary + '20' }]}>
          <Icon name={isVideo ? 'play-circle' : 'open-in-new'} size={24} color={colors.primary} />
        </View>
        <View style={styles.resourceContent}>
          <Text style={[styles.resourceTitle, { color: colors.text }]}>
            {isVideo ? 'Regarder la vidéo' : 'Ouvrir la ressource'}
          </Text>
          <Text style={[styles.resourceUrl, { color: colors.textSecondary }]} numberOfLines={1}>
            {content.resourceUrl || content.videoUrl}
          </Text>
        </View>
        <Icon name="chevron-right" size={24} color={colors.textSecondary} />
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          {renderContentTypeInfo()}
          <View style={styles.headerMeta}>
            <View style={styles.headerMetaItem}>
              <Icon name="schedule" size={14} color={colors.textSecondary} />
              <Text style={[styles.headerMetaText, { color: colors.textSecondary }]}>
                {content.estimatedMinutes} min
              </Text>
            </View>
            <View style={styles.headerMetaItem}>
              <Icon name="emoji-events" size={14} color={colors.xp} />
              <Text style={[styles.headerMetaText, { color: colors.xp }]}>
                {content.xpReward} XP
              </Text>
            </View>
          </View>
        </View>

        <Text style={[styles.title, { color: colors.text }]}>{content.title}</Text>
        <Text style={[styles.description, { color: colors.textSecondary }]}>
          {content.description}
        </Text>
      </View>

      {/* Content */}
      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {renderContentBody()}
        {renderExternalResource()}

        {content.contentType === 'exercise' && content.contentBody && (
          <View style={[styles.exerciseBox, { backgroundColor: colors.success + '10', borderColor: colors.success + '30' }]}>
            <View style={styles.exerciseBoxHeader}>
              <Icon name="fitness-center" size={20} color={colors.success} />
              <Text style={[styles.exerciseBoxTitle, { color: colors.success }]}>
                À vous de pratiquer!
              </Text>
            </View>
            <Text style={[styles.exerciseBoxText, { color: colors.success }]}>
              Complétez cet exercice pour gagner {content.xpReward} XP
            </Text>
          </View>
        )}

        {/* Bottom spacing for footer */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Footer Actions */}
      <View style={[styles.footer, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
        <TouchableOpacity
          style={[styles.exitButton, { borderColor: colors.border }]}
          onPress={onExit}
        >
          <Icon name="close" size={20} color={colors.textSecondary} />
          <Text style={[styles.exitText, { color: colors.textSecondary }]}>
            Quitter
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.completeButton, { backgroundColor: colors.primary }]}
          onPress={onComplete}
        >
          <Icon name="check-circle" size={20} color={colors.buttonText} />
          <Text style={[styles.completeButtonText, { color: colors.buttonText }]}>
            {content.contentType === 'exercise' ? "J'ai terminé" : 'Marquer comme complété'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  typeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  headerMeta: {
    flexDirection: 'row',
    gap: 12,
  },
  headerMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  headerMetaText: {
    fontSize: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    lineHeight: 32,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  scrollContent: {
    flex: 1,
  },
  contentBody: {
    padding: 20,
  },
  header1: {
    fontSize: 22,
    fontWeight: '700',
    marginTop: 8,
  },
  header2: {
    fontSize: 18,
    fontWeight: '600',
  },
  header3: {
    fontSize: 16,
    fontWeight: '600',
  },
  listItem: {
    fontSize: 15,
    lineHeight: 24,
    marginLeft: 8,
    marginVertical: 4,
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 24,
    marginVertical: 8,
  },
  spacing: {
    height: 16,
  },
  tableRow: {
    flexDirection: 'row',
    marginVertical: 4,
  },
  tableCell: {
    flex: 1,
    fontSize: 14,
    padding: 8,
    borderWidth: 1,
    textAlign: 'center',
  },
  resourceLink: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 20,
    marginTop: 10,
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  resourceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resourceContent: {
    flex: 1,
  },
  resourceTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  resourceUrl: {
    fontSize: 13,
  },
  exerciseBox: {
    margin: 20,
    marginTop: 10,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
  },
  exerciseBoxHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  exerciseBoxTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  exerciseBoxText: {
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
  },
  exitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    flex: 1,
    gap: 8,
  },
  exitText: {
    fontSize: 16,
    fontWeight: '600',
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    flex: 2,
    gap: 8,
  },
  completeButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
});
