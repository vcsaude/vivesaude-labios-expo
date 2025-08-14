#!/usr/bin/env bash
set -euo pipefail

REPO_ARG="${1:-}"

if ! command -v gh >/dev/null 2>&1; then
  echo "[error] GitHub CLI 'gh' not found. Install: https://cli.github.com/" >&2
  exit 1
fi

# Resolve repo (owner/name)
if [[ -z "$REPO_ARG" ]]; then
  ORIGIN_URL=$(git remote get-url origin 2>/dev/null || true)
  if [[ "$ORIGIN_URL" =~ github.com[:/](.*)\.git ]]; then
    REPO="${BASH_REMATCH[1]}"
  else
    echo "[error] Could not detect GitHub repo from origin. Pass 'owner/name' as first arg." >&2
    exit 1
  fi
else
  REPO="$REPO_ARG"
fi

echo "Target repo: $REPO"

# Load values from .env or .env.example
ENVFILE=".env"
[[ -f "$ENVFILE" ]] || ENVFILE=".env.example"

declare -A ENV
while IFS= read -r line; do
  [[ -z "$line" || "$line" =~ ^# ]] && continue
  # strip inline comments after space-#
  VAL_NO_COMMENT="${line%% #*}"
  KEY="${VAL_NO_COMMENT%%=*}"
  VAL="${VAL_NO_COMMENT#*=}"
  KEY="${KEY//[$'\r\n\t ']}"
  [[ -z "$KEY" ]] && continue
  ENV["$KEY"]="$VAL"
done < "$ENVFILE"

# Classification: which keys are Secrets vs Variables
read -r -d '' SECRET_KEYS << 'EOF' || true
EXPO_TOKEN
AI_API_KEY
OCR_API_KEY
STORAGE_ACCESS_KEY
STORAGE_SECRET_KEY
JWT_SECRET
GOOGLE_OAUTH_CLIENT_SECRET
APPLE_OAUTH_PRIVATE_KEY
ENCRYPTION_KEY
ENCRYPTION_IV
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
TWILIO_AUTH_TOKEN
EMAIL_SERVICE_API_KEY
NEW_RELIC_LICENSE_KEY
SENTRY_DSN
ANDROID_LICENSE_KEY
IOS_SHARED_SECRET
FHIR_CLIENT_SECRET
EOF

read -r -d '' VAR_KEYS << 'EOF' || true
EXPO_PUBLIC_APP_ENV
EXPO_PUBLIC_APP_VERSION
EXPO_PUBLIC_API_URL
EXPO_PUBLIC_WEB_URL
EXPO_PUBLIC_USE_API_MODE
EXPO_PUBLIC_MAX_UPLOAD_MB
EXPO_PUBLIC_LOCALE
API_BASE_URL
API_TIMEOUT
API_RETRY_ATTEMPTS
AI_SERVICE_URL
AI_MODEL_VERSION
OCR_SERVICE_URL
STORAGE_BUCKET
STORAGE_REGION
JWT_EXPIRES_IN
JWT_REFRESH_EXPIRES_IN
GOOGLE_OAUTH_CLIENT_ID
APPLE_OAUTH_CLIENT_ID
BIOMETRIC_FALLBACK_ENABLED
BIOMETRIC_TIMEOUT
HIPAA_ENCRYPTION_ENABLED
HIPAA_AUDIT_LOG_ENABLED
HIPAA_DATA_RETENTION_DAYS
LGPD_CONSENT_REQUIRED
LGPD_DATA_PORTABILITY_ENABLED
LGPD_RIGHT_TO_DELETION_ENABLED
AUDIT_LOG_LEVEL
AUDIT_LOG_RETENTION_DAYS
AUDIT_LOG_ENCRYPTION
COINS_PER_ANALYSIS_BASIC
COINS_PER_ANALYSIS_ADVANCED
COINS_PER_ANALYSIS_SPECIALIST
COINS_PER_ANALYSIS_RESEARCH
COINS_PER_ANALYSIS_DOCTORATE
STRIPE_PUBLIC_KEY
EXPO_PUSH_TOKEN
EMAIL_FROM_ADDRESS
EMAIL_FROM_NAME
TWILIO_ACCOUNT_SID
TWILIO_FROM_NUMBER
MIXPANEL_PROJECT_TOKEN
GA_MEASUREMENT_ID
SENTRY_ENVIRONMENT
SENTRY_RELEASE
NEW_RELIC_APP_NAME
HEALTH_CHECK_INTERVAL
HEALTH_CHECK_TIMEOUT
FEATURE_DEV_MENU
FEATURE_DEBUG_MODE
FEATURE_MOCK_DATA
FEATURE_AI_ADVANCED_ANALYSIS
FEATURE_VOICE_COMMANDS
FEATURE_APPLE_HEALTH_SYNC
FEATURE_TELEMEDICINE
AB_TEST_ONBOARDING_V2
AB_TEST_PRICING_MODEL
AB_TEST_AI_EXPLANATIONS
APPLE_HEALTH_ENABLED
APPLE_HEALTH_PERMISSIONS
GOOGLE_FIT_ENABLED
GOOGLE_FIT_CLIENT_ID
LAB_INTEGRATION_ENABLED
LAB_API_ENDPOINTS
FHIR_SERVER_URL
FHIR_CLIENT_ID
DEV_API_URL
DEV_AI_URL
DEV_OCR_URL
TEST_USER_EMAIL
TEST_USER_PASSWORD
TEST_SKIP_AUTH
TEST_MOCK_BIOMETRICS
EOF

exported_secrets=0
exported_vars=0

set_var() {
  local key="$1"; shift
  local val="$1"; shift
  if [[ -z "$val" ]]; then
    echo "[skip] $key has no value; skipping"
    return
  fi
  gh variable set "$key" --repo "$REPO" --body "$val" >/dev/null
  echo "[var]  $key"
  exported_vars=$((exported_vars+1))
}

set_secret() {
  local key="$1"; shift
  local val="$1"; shift
  if [[ -z "$val" ]]; then
    echo "[skip] $key has no value; skipping"
    return
  fi
  gh secret set "$key" --repo "$REPO" --body "$val" >/dev/null
  echo "[sec]  $key"
  exported_secrets=$((exported_secrets+1))
}

echo "Exporting repository Variables..."
while IFS= read -r key; do
  [[ -z "$key" ]] && continue
  val="${!key-}"
  [[ -z "$val" && -n "${ENV[$key]-}" ]] && val="${ENV[$key]}"
  set_var "$key" "$val"
done <<< "$VAR_KEYS"

echo "Exporting repository Secrets..."
while IFS= read -r key; do
  [[ -z "$key" ]] && continue
  val="${!key-}"
  [[ -z "$val" && -n "${ENV[$key]-}" ]] && val="${ENV[$key]}"
  set_secret "$key" "$val"
done <<< "$SECRET_KEYS"

echo "Done. Exported $exported_vars variables and $exported_secrets secrets to $REPO"

