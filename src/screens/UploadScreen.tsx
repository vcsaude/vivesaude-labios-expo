import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Animated, Linking, AccessibilityInfo } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { examsService } from '../services/exams';
import * as FileSystem from 'expo-file-system';
import { addHistory, getHistory, type UploadEntry, clearHistory, updateHistory } from '../services/history';
import { formatBytes, formatDate } from '../utils/format';
import { appConfig } from '../config/app';
import i18n from '../i18n';
import { analytics } from '../services/analytics';

const palette = {
  primary: '#1a1a2e',
  bg: '#ffffff',
  surface: '#f8fafc',
  border: '#e2e8f0',
  text: '#1a1a2e',
  textSecondary: '#64748b',
};

type Picked = { uri: string; name: string; size?: number } | null;

export default function UploadScreen() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [picked, setPicked] = useState<Picked>(null);
  const [history, setHistory] = useState<UploadEntry[]>([]);
  const [success, setSuccess] = useState(false);
  const successOpacity = useRef(new Animated.Value(0)).current;
  const successScale = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    (async () => setHistory(await getHistory()))();
  }, []);

  const pick = async () => {
    setMessage(null);
    analytics.track('upload_open_picker');
    const res = await DocumentPicker.getDocumentAsync({ type: 'application/pdf', multiple: false });
    const asset = res.assets?.[0];
    if (!asset) return;
    let size = asset.size;
    if (size == null) {
      try {
        const info = await FileSystem.getInfoAsync(asset.uri);
        if (info.exists && typeof info.size === 'number') size = info.size;
      } catch {}
    }
    const name = asset.name ?? 'exame.pdf';
    const mime = (asset as any).mimeType as string | undefined;
    const isPdf = (mime && mime.includes('pdf')) || name.toLowerCase().endsWith('.pdf');
    if (!isPdf) {
      setPicked(null);
      setMessage(i18n.t('invalid_format'));
      return;
    }
    const maxBytes = appConfig.maxUploadMb * 1024 * 1024;
    if (size != null && size > maxBytes) {
      setPicked(null);
      setMessage(i18n.t('too_large', { max: appConfig.maxUploadMb }));
      return;
    }
    setPicked({ uri: asset.uri, name, size });
    analytics.track('upload_selected', { size: size ?? 0 });
  };

  const upload = async () => {
    if (!picked) return;
    setLoading(true);
    try {
      await examsService.uploadPdf(picked.uri);
      const entry: UploadEntry = {
        id: `upload-${Date.now()}`,
        name: picked.name,
        size: picked.size,
        uri: picked.uri,
        uploadedAt: new Date().toISOString(),
        status: 'sent',
      };
      await addHistory(entry);
      setHistory((prev) => [entry, ...prev].slice(0, 10));
      setMessage(i18n.t('success_msg'));
      setPicked(null);
      setSuccess(true);
      successOpacity.setValue(0);
      successScale.setValue(0.9);
      AccessibilityInfo.announceForAccessibility?.('Exame enviado com sucesso. Obrigado!');
      Animated.parallel([
        Animated.timing(successOpacity, { toValue: 1, duration: 250, useNativeDriver: true }),
        Animated.spring(successScale, { toValue: 1, useNativeDriver: true, friction: 6 }),
      ]).start(() => {
        setTimeout(() => {
          Animated.timing(successOpacity, { toValue: 0, duration: 250, useNativeDriver: true }).start(() => setSuccess(false));
        }, 900);
      });
      analytics.track('upload_sent', { size: picked.size ?? 0 });
    } catch (e) {
      analytics.track('upload_failed', { reason: 'network', size: picked.size ?? 0 });
      const entry: UploadEntry = {
        id: `upload-${Date.now()}`,
        name: picked.name,
        size: picked.size,
        uri: picked.uri,
        uploadedAt: new Date().toISOString(),
        status: 'failed',
        errorMessage: 'Falha ao enviar.'
      };
      await addHistory(entry);
      setHistory((prev) => [entry, ...prev].slice(0, 10));
      setMessage(i18n.t('error_msg'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.logo}>⎗</Text>
        <Text style={styles.title}>{i18n.t('upload_title')}</Text>
        <Text style={styles.subtitle}>{i18n.t('upload_subtitle')}</Text>
        <Text style={styles.note}>{i18n.t('upload_note', { max: appConfig.maxUploadMb })}</Text>

        {!picked ? (
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={pick}
            disabled={loading}
            accessibilityRole="button"
            accessibilityLabel={i18n.t('a11y_select_pdf')}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.primaryText}>{i18n.t('select_pdf')}</Text>
            )}
          </TouchableOpacity>
        ) : (
          <View style={styles.confirmBox}>
            <Text style={styles.confirmTitle}>{i18n.t('confirm_send')}</Text>
            <Text style={styles.confirmLine}>{i18n.t('file_label')}: <Text style={styles.bold}>{picked.name}</Text></Text>
            <Text style={styles.confirmLine}>{i18n.t('size_label')}: <Text style={styles.bold}>{formatBytes(picked.size)}</Text></Text>
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
              <TouchableOpacity
                style={[styles.secondaryBtn]}
                onPress={() => setPicked(null)}
                disabled={loading}
                accessibilityRole="button"
                accessibilityLabel={i18n.t('a11y_change_file')}
              >
                <Text style={styles.secondaryText}>{i18n.t('change_file')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.primaryBtn, { flex: 1 }]}
                onPress={upload}
                disabled={loading}
                accessibilityRole="button"
                accessibilityLabel={i18n.t('a11y_send_now')}
              >
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryText}>{i18n.t('send_now')}</Text>}
              </TouchableOpacity>
            </View>
          </View>
        )}

        {!!message && <Text style={styles.message}>{message}</Text>}
      </View>
      {/* Legal links */}
      <View style={styles.legalBox}>
        <Text style={styles.legalText}>
          {i18n.t('terms_sentence', { terms: i18n.t('terms'), privacy: i18n.t('privacy') })}
          {' '}<Text style={styles.link} onPress={() => Linking.openURL(appConfig.termsUrl)}>{i18n.t('terms')}</Text>
          {' '}<Text>{i18n.lang === 'pt-BR' ? 'e' : 'and'}</Text>{' '}
          <Text style={styles.link} onPress={() => Linking.openURL(appConfig.privacyUrl)}>{i18n.t('privacy')}</Text>.
        </Text>
      </View>

      {/* Recent uploads */}
      <View style={styles.historyCard}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={styles.historyTitle}>Envios recentes</Text>
          {history.length > 0 && (
            <TouchableOpacity
              onPress={async () => { await clearHistory(); setHistory([]); analytics.track('history_cleared'); }}
              accessibilityRole="button"
              accessibilityLabel={i18n.t('a11y_clear_history')}
            >
              <Text style={styles.clearText}>{i18n.t('clear')}</Text>
            </TouchableOpacity>
          )}
        </View>
        {history.length === 0 ? (
          <Text style={styles.historyEmpty}>Nenhum envio ainda.</Text>
        ) : (
          history.slice(0, 5).map((h) => (
            <View key={h.id} style={styles.historyRow}>
              <View style={styles.statusIconWrap} accessibilityLabel={h.status === 'sent' ? 'Enviado' : 'Falhou'}>
                <Text style={[styles.statusIcon, h.status === 'sent' ? styles.statusOk : styles.statusFail]}>
                  {h.status === 'sent' ? '✓' : '!'}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.historyName} numberOfLines={1}>{h.name}</Text>
                <Text style={styles.historyMeta}>{formatBytes(h.size)} • {formatDate(h.uploadedAt)}</Text>
              </View>
              {h.status === 'failed' && (
                <TouchableOpacity
                  style={styles.retryBtn}
                  disabled={loading}
                  accessibilityRole="button"
                  accessibilityLabel={`${i18n.t('retry')} ${h.name}`}
                  onPress={async () => {
                    setPicked({ uri: h.uri, name: h.name, size: h.size });
                    analytics.track('upload_retry');
                    await upload();
                  }}
                >
                  <Text style={styles.retryText}>{i18n.t('retry')}</Text>
                </TouchableOpacity>
              )}
            </View>
          ))
        )}
      </View>
      {/* Success overlay */}
      {success && (
        <View style={styles.overlay} pointerEvents="none">
          <Animated.View style={[styles.checkWrap, { opacity: successOpacity, transform: [{ scale: successScale }] }]}>
            <Text style={styles.checkIcon}>✓</Text>
          </Animated.View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.surface,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 440,
    backgroundColor: palette.bg,
    borderRadius: 16,
    padding: 24,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: palette.border,
  },
  logo: { fontSize: 48, textAlign: 'center', marginBottom: 12 },
  title: { fontSize: 20, fontWeight: '800', color: palette.text, textAlign: 'center' },
  subtitle: { fontSize: 14, color: palette.textSecondary, textAlign: 'center', marginTop: 6 },
  note: { fontSize: 12, color: palette.textSecondary, textAlign: 'center', marginTop: 4 },
  primaryBtn: {
    marginTop: 20,
    backgroundColor: palette.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryText: { color: '#fff', fontWeight: '700' },
  secondaryBtn: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: palette.border,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: palette.bg,
  },
  secondaryText: { color: palette.text, fontWeight: '700' },
  confirmBox: {
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.surface,
  },
  confirmTitle: { fontSize: 16, fontWeight: '800', color: palette.text },
  confirmLine: { marginTop: 4, color: palette.textSecondary },
  bold: { color: palette.text, fontWeight: '700' },
  message: { marginTop: 16, textAlign: 'center', color: palette.textSecondary, fontWeight: '600' },
  historyCard: {
    width: '100%',
    maxWidth: 440,
    marginTop: 16,
    backgroundColor: palette.bg,
    borderRadius: 16,
    padding: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: palette.border,
  },
  historyTitle: { fontSize: 16, fontWeight: '800', color: palette.text },
  clearText: { color: palette.textSecondary, fontWeight: '600' },
  historyEmpty: { marginTop: 8, color: palette.textSecondary },
  historyRow: { marginTop: 10 },
  statusIconWrap: { width: 28, alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  statusIcon: { fontWeight: '900', fontSize: 16 },
  statusOk: { color: '#10b981' },
  statusFail: { color: '#F59E0B' },
  historyName: { color: palette.text, fontWeight: '700' },
  historyMeta: { color: palette.textSecondary },
  retryBtn: {
    marginLeft: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.bg,
  },
  retryText: { color: palette.text, fontWeight: '700' },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.12)'
  },
  checkWrap: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#10b981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkIcon: { color: '#fff', fontSize: 48, fontWeight: '900' },
  legalBox: { maxWidth: 440, marginTop: 12 },
  legalText: { color: palette.textSecondary, textAlign: 'center' },
  link: { color: '#0066CC', fontWeight: '700' },
});
