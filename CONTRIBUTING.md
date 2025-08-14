# 🤝 Contributing to ViveSaude Lábios

Thank you for your interest in contributing to ViveSaude Lábios! This project aims to revolutionize healthcare accessibility through intelligent lab exam digitalization and analysis.

## 🏥 Healthcare Application Guidelines

**⚠️ CRITICAL REMINDERS**:
- This app handles sensitive medical data (PHI - Protected Health Information)
- All contributions must maintain HIPAA and LGPD compliance
- Never commit real patient data or sensitive information
- Security and privacy are non-negotiable priorities

## 🚀 Quick Start for Contributors

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git
- Expo CLI (`npm install -g @expo/cli`)
- EAS CLI (`npm install -g eas-cli`)

### Setup Development Environment
```bash
# 1. Fork and clone the repository
git clone https://github.com/YOUR_USERNAME/vivesaude-labios-expo.git
cd vivesaude-labios-expo

# 2. Install dependencies
npm install
npx expo install --fix

# 3. Copy environment variables
cp .env.example .env
# Edit .env with your development values

# 4. Start development server
expo start

# 5. Run tests
npm test
```

## 🎯 How to Contribute

### 1. 🐛 Reporting Bugs
- Use the [Bug Report template](.github/ISSUE_TEMPLATE/bug_report.yml)
- **Never include real patient data**
- Provide detailed reproduction steps
- Include device/platform information

### 2. ✨ Suggesting Features
- Use the [Feature Request template](.github/ISSUE_TEMPLATE/feature_request.yml)
- Consider healthcare compliance implications
- Provide detailed use cases and user stories
- Think about accessibility and inclusivity

### 3. 💻 Code Contributions

#### Development Workflow
```bash
# 1. Create a feature branch
git checkout -b feature/your-feature-name

# 2. Make your changes
# (Follow coding standards below)

# 3. Run tests and linting
npm test
npm run lint
npm run type-check

# 4. Commit your changes
git commit -m "feat: add amazing feature"

# 5. Push and create PR
git push origin feature/your-feature-name
# Create PR using the template
```

#### Branch Naming Convention
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test improvements
- `chore/` - Maintenance tasks

Examples:
- `feature/ai-analysis-v2`
- `fix/pdf-upload-crash`
- `docs/api-integration-guide`

## 📝 Coding Standards

### TypeScript Guidelines
```typescript
// ✅ Good - Explicit types and healthcare context
interface ExamResult {
  id: string;
  patientId: string; // Always anonymized/encrypted
  examType: ExamType;
  results: LabValue[];
  analyzedAt: Date;
  complianceFlags: ComplianceFlag[];
}

// ❌ Bad - Any types and unclear context
interface Result {
  id: any;
  data: any;
  stuff: any[];
}
```

### Component Structure
```tsx
// ✅ Good - Healthcare-focused component
interface ExamCardProps {
  exam: Exam;
  onAnalyze: (examId: string) => void;
  showSensitiveData?: boolean; // Explicit privacy control
}

export const ExamCard: React.FC<ExamCardProps> = ({
  exam,
  onAnalyze,
  showSensitiveData = false
}) => {
  // Component implementation
};
```

### Security & Privacy Guidelines
```typescript
// ✅ Good - Secure data handling
const encryptSensitiveData = async (data: string): Promise<EncryptedData> => {
  const encrypted = await CryptoService.encrypt(data);
  auditLog('data_encrypted', { type: 'exam_result' });
  return encrypted;
};

// ❌ Bad - Logging sensitive data
console.log('Patient data:', patientInfo); // NEVER DO THIS
localStorage.setItem('patient', JSON.stringify(patient)); // NEVER DO THIS
```

### Error Handling
```typescript
// ✅ Good - Healthcare-compliant error handling
try {
  const analysis = await AIService.analyzeExam(examData);
  auditLog('analysis_completed', { examId: exam.id });
  return analysis;
} catch (error) {
  auditLog('analysis_failed', { 
    examId: exam.id, 
    error: error.message // No sensitive data in logs
  });
  throw new AnalysisError('Failed to analyze exam', error.code);
}
```

## 🧪 Testing Requirements

### Test Coverage Requirements
- **Critical Paths**: 100% coverage (auth, payment, data encryption)
- **Core Features**: 90% coverage (upload, analysis, results)
- **UI Components**: 80% coverage
- **Utilities**: 95% coverage

### Test Categories
```typescript
// Unit Tests - Individual functions/components
describe('ExamAnalyzer', () => {
  it('should encrypt sensitive data before analysis', async () => {
    // Test implementation
  });
});

// Integration Tests - Feature workflows
describe('Exam Upload Flow', () => {
  it('should complete full upload and analysis workflow', async () => {
    // Test implementation
  });
});

// E2E Tests - User journeys
describe('Complete Analysis Journey', () => {
  it('should allow user to upload, analyze, and view results', async () => {
    // Test implementation
  });
});
```

### Test Data Guidelines
```typescript
// ✅ Good - Synthetic test data
const mockExamData = {
  patientId: 'test-patient-001',
  results: [
    { parameter: 'glucose', value: '95', unit: 'mg/dL' }
  ]
};

// ❌ Bad - Real or realistic patient data
const realPatientData = {
  name: 'John Doe',
  ssn: '123-45-6789',
  // NEVER use real data
};
```

## 🏥 Healthcare Compliance Guidelines

### HIPAA Compliance Checklist
- [ ] **Minimum Necessary Rule**: Only access/display necessary data
- [ ] **Access Controls**: Proper authentication and authorization
- [ ] **Audit Trails**: Log all data access and modifications
- [ ] **Data Encryption**: Encrypt data at rest and in transit
- [ ] **Secure Communication**: Use HTTPS/TLS for all communications
- [ ] **Incident Response**: Proper error handling and reporting

### LGPD Compliance Checklist
- [ ] **Lawful Basis**: Clear legal basis for data processing
- [ ] **Consent Management**: Explicit consent mechanisms
- [ ] **Data Minimization**: Collect only necessary data
- [ ] **Right to Access**: Users can access their data
- [ ] **Right to Deletion**: Users can delete their data
- [ ] **Data Portability**: Users can export their data

### Security Requirements
```typescript
// ✅ Required security patterns
class SecureDataHandler {
  async storeData(data: SensitiveData): Promise<void> {
    // 1. Validate input
    const validated = this.validateInput(data);
    
    // 2. Encrypt before storage
    const encrypted = await this.encrypt(validated);
    
    // 3. Store with audit trail
    await this.store(encrypted);
    this.auditLog('data_stored', { type: data.type });
  }
}
```

## 🎨 UI/UX Guidelines

### Accessibility Requirements
- **WCAG 2.1 AA** compliance minimum
- **VoiceOver/TalkBack** compatibility
- **Dynamic Type** support
- **High Contrast** mode support
- **Keyboard Navigation** (when applicable)

### Design System Usage
```tsx
// ✅ Good - Using design system
import { Colors, Fonts, Spacing } from '@/constants/theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    padding: Spacing.md,
  },
  title: {
    ...Fonts.heading,
    color: Colors.text,
  },
});
```

### Healthcare-Specific UI Patterns
```tsx
// ✅ Good - Medical result display
const ResultValue: React.FC<ResultValueProps> = ({ result }) => {
  const statusColor = getResultStatusColor(result.status);
  const accessibilityLabel = `${result.parameter}: ${result.value} ${result.unit}, ${result.status}`;
  
  return (
    <View style={[styles.resultRow, { borderLeftColor: statusColor }]}>
      <Text accessibilityLabel={accessibilityLabel}>
        {result.parameter}: {result.value} {result.unit}
      </Text>
      <ResultStatusIcon status={result.status} />
    </View>
  );
};
```

## 📚 Documentation Standards

### Code Documentation
```typescript
/**
 * Analyzes lab exam results using AI models
 * 
 * @param examData - Encrypted exam data from PDF processing
 * @param analysisLevel - Analysis depth (basic to doctorate level)
 * @returns Promise<AnalysisResult> - AI analysis with confidence scores
 * 
 * @throws AnalysisError - When AI service is unavailable
 * @throws ValidationError - When exam data is invalid
 * 
 * @example
 * ```typescript
 * const result = await analyzeExam(examData, 'advanced');
 * console.log(result.insights);
 * ```
 */
async function analyzeExam(
  examData: EncryptedExamData,
  analysisLevel: AnalysisLevel
): Promise<AnalysisResult> {
  // Implementation
}
```

### API Documentation
- Use OpenAPI/Swagger for API endpoints
- Include request/response examples
- Document error codes and meanings
- Specify authentication requirements

## 🔄 Pull Request Process

### Before Submitting
1. **Self-Review**: Review your own code thoroughly
2. **Testing**: Ensure all tests pass
3. **Documentation**: Update relevant documentation
4. **Compliance**: Verify healthcare compliance
5. **Security**: Check for security implications

### PR Template Usage
Use the [PR template](.github/pull_request_template.md) and:
- Fill out all relevant sections
- Include screenshots/videos for UI changes
- List any breaking changes
- Mention healthcare compliance considerations

### Review Process
1. **Automated Checks**: CI/CD pipeline must pass
2. **Code Review**: At least 2 approvals required
3. **Security Review**: Required for sensitive changes
4. **Compliance Review**: Healthcare compliance verification
5. **Final Approval**: Maintainer approval for merge

## 🏆 Recognition

### Contributor Levels
- **First-time Contributor**: Welcomed with mentoring
- **Regular Contributor**: Added to contributors list
- **Core Contributor**: Invited to team discussions
- **Maintainer**: Full repository access and responsibilities

### Hall of Fame
Contributors who make significant impacts will be recognized in:
- Project README
- Release notes
- Annual contributor highlights
- Conference presentations (with permission)

## 🆘 Getting Help

### Where to Ask Questions
- **GitHub Discussions**: General questions and ideas
- **Discord/Slack**: Real-time development chat
- **Email**: security@vivesaude.com.br (security issues only)
- **Office Hours**: Weekly contributor meetups

### Mentorship Program
New contributors can request mentorship for:
- Healthcare app development best practices
- Understanding compliance requirements
- Code review and feedback
- Career development in health tech

## 📋 Compliance & Legal

### Contributor License Agreement (CLA)
By contributing, you agree that:
- Your contributions will be licensed under the project license
- You have the right to contribute the code
- You understand healthcare data sensitivity requirements
- You agree to follow all compliance guidelines

### Code of Conduct
This project follows our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you agree to uphold this code.

## 🚀 Release Process

### Version Numbering
We follow [Semantic Versioning](https://semver.org/):
- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Schedule
- **Patch releases**: As needed for critical fixes
- **Minor releases**: Monthly feature releases
- **Major releases**: Quarterly with breaking changes

---

## 🙏 Thank You

Your contributions help improve healthcare accessibility and make a real difference in people's lives. Every bug fix, feature addition, and documentation improvement helps patients better understand and manage their health.

**Remember**: We're not just building an app—we're building trust, improving health outcomes, and democratizing access to medical information.

---

*For questions about this contributing guide, please open an issue or contact the maintainers.*