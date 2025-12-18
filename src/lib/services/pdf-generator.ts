import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  renderToBuffer,
} from '@react-pdf/renderer';
import type { BrandKit } from '../types/brand';
import { getAccessibleTextColor } from '../utils/color';

// PDF Styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 40,
  },
  coverPage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverTitle: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  coverSubtitle: {
    fontSize: 18,
    color: '#6b7280',
    marginBottom: 40,
  },
  coverDate: {
    fontSize: 12,
    color: '#9ca3af',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#111827',
    borderBottomWidth: 2,
    borderBottomColor: '#e5e7eb',
    paddingBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    marginTop: 16,
    color: '#374151',
  },
  paragraph: {
    fontSize: 11,
    lineHeight: 1.6,
    color: '#4b5563',
    marginBottom: 8,
  },
  colorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  colorSwatch: {
    width: 80,
    height: 80,
    marginRight: 12,
    marginBottom: 12,
    borderRadius: 8,
    justifyContent: 'flex-end',
    padding: 6,
  },
  colorSwatchSmall: {
    width: 50,
    height: 50,
    marginRight: 8,
    marginBottom: 8,
    borderRadius: 4,
  },
  colorLabel: {
    fontSize: 8,
    fontWeight: 'bold',
  },
  colorHex: {
    fontSize: 7,
  },
  fontDisplay: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
  },
  fontName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  fontSample: {
    fontSize: 24,
    marginBottom: 4,
  },
  typescaleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  typescaleLabel: {
    width: 60,
    fontSize: 10,
    color: '#6b7280',
  },
  typescaleSize: {
    width: 50,
    fontSize: 10,
    color: '#9ca3af',
  },
  voiceCard: {
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  voicePrinciple: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#111827',
  },
  voiceDescription: {
    fontSize: 10,
    color: '#4b5563',
    marginBottom: 6,
  },
  voiceExample: {
    fontSize: 10,
    fontStyle: 'italic',
    color: '#6b7280',
    marginTop: 8,
    padding: 8,
    backgroundColor: '#ffffff',
    borderRadius: 4,
  },
  pageNumber: {
    position: 'absolute',
    fontSize: 10,
    bottom: 20,
    right: 40,
    color: '#9ca3af',
  },
  footer: {
    position: 'absolute',
    fontSize: 8,
    bottom: 20,
    left: 40,
    color: '#d1d5db',
  },
});

// Create the PDF document
function createBrandGuidelinesPDF(brandKit: BrandKit) {
  const primaryColor = brandKit.colors.primary[0]?.hex || '#3b82f6';

  return React.createElement(
    Document,
    {
      title: `${brandKit.name} Brand Guidelines`,
      author: 'Brand Kit Generator',
    },
    // Cover Page
    React.createElement(
      Page,
      { size: 'A4', style: styles.page },
      React.createElement(
        View,
        { style: styles.coverPage },
        React.createElement(
          View,
          {
            style: {
              width: 120,
              height: 120,
              backgroundColor: primaryColor,
              borderRadius: 20,
              marginBottom: 40,
            },
          }
        ),
        React.createElement(Text, { style: styles.coverTitle }, brandKit.name),
        React.createElement(Text, { style: styles.coverSubtitle }, 'Brand Guidelines'),
        React.createElement(
          Text,
          { style: styles.coverDate },
          `Generated ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`
        )
      )
    ),

    // Color Palette Page
    React.createElement(
      Page,
      { size: 'A4', style: styles.page },
      React.createElement(
        View,
        { style: styles.section },
        React.createElement(Text, { style: styles.sectionTitle }, 'Color Palette'),
        React.createElement(
          Text,
          { style: styles.paragraph },
          'Our color palette ensures consistency across all brand touchpoints.'
        ),

        // Primary Colors
        React.createElement(Text, { style: styles.sectionSubtitle }, 'Primary Colors'),
        React.createElement(
          View,
          { style: styles.colorRow },
          ...brandKit.colors.primary.map((color, i) =>
            React.createElement(
              View,
              {
                key: `primary-${i}`,
                style: [styles.colorSwatch, { backgroundColor: color.hex }],
              },
              React.createElement(
                Text,
                { style: [styles.colorLabel, { color: getAccessibleTextColor(color.hex) }] },
                color.name || `Primary ${i + 1}`
              ),
              React.createElement(
                Text,
                { style: [styles.colorHex, { color: getAccessibleTextColor(color.hex) }] },
                color.hex.toUpperCase()
              )
            )
          )
        ),

        // Secondary Colors
        brandKit.colors.secondary.length > 0 &&
          React.createElement(Text, { style: styles.sectionSubtitle }, 'Secondary Colors'),
        brandKit.colors.secondary.length > 0 &&
          React.createElement(
            View,
            { style: styles.colorRow },
            ...brandKit.colors.secondary.map((color, i) =>
              React.createElement(
                View,
                {
                  key: `secondary-${i}`,
                  style: [styles.colorSwatch, { backgroundColor: color.hex }],
                },
                React.createElement(
                  Text,
                  { style: [styles.colorLabel, { color: getAccessibleTextColor(color.hex) }] },
                  color.name || `Secondary ${i + 1}`
                ),
                React.createElement(
                  Text,
                  { style: [styles.colorHex, { color: getAccessibleTextColor(color.hex) }] },
                  color.hex.toUpperCase()
                )
              )
            )
          ),

        // Neutral Colors
        React.createElement(Text, { style: styles.sectionSubtitle }, 'Neutral Colors'),
        React.createElement(
          View,
          { style: styles.colorRow },
          ...brandKit.colors.neutral.slice(0, 8).map((color, i) =>
            React.createElement(View, {
              key: `neutral-${i}`,
              style: [styles.colorSwatchSmall, { backgroundColor: color.hex }],
            })
          )
        ),

        // Semantic Colors
        React.createElement(Text, { style: styles.sectionSubtitle }, 'Semantic Colors'),
        React.createElement(
          View,
          { style: styles.colorRow },
          ...[
            { name: 'Success', color: brandKit.colors.semantic.success },
            { name: 'Error', color: brandKit.colors.semantic.error },
            { name: 'Warning', color: brandKit.colors.semantic.warning },
            { name: 'Info', color: brandKit.colors.semantic.info },
          ].map((item) =>
            React.createElement(
              View,
              {
                key: item.name,
                style: [styles.colorSwatch, { backgroundColor: item.color.hex }],
              },
              React.createElement(
                Text,
                { style: [styles.colorLabel, { color: getAccessibleTextColor(item.color.hex) }] },
                item.name
              ),
              React.createElement(
                Text,
                { style: [styles.colorHex, { color: getAccessibleTextColor(item.color.hex) }] },
                item.color.hex.toUpperCase()
              )
            )
          )
        )
      ),
      React.createElement(Text, { style: styles.footer }, 'Brand Kit Generator')
    ),

    // Typography Page
    React.createElement(
      Page,
      { size: 'A4', style: styles.page },
      React.createElement(
        View,
        { style: styles.section },
        React.createElement(Text, { style: styles.sectionTitle }, 'Typography'),
        React.createElement(
          Text,
          { style: styles.paragraph },
          'Typography plays a crucial role in establishing brand identity.'
        ),

        // Heading Font
        React.createElement(
          View,
          { style: styles.fontDisplay },
          React.createElement(
            Text,
            { style: styles.fontName },
            `Heading Font: ${brandKit.typography.headingFont.family}`
          ),
          React.createElement(
            Text,
            { style: styles.fontSample },
            'The quick brown fox jumps over'
          ),
          React.createElement(
            Text,
            { style: styles.paragraph },
            `Category: ${brandKit.typography.headingFont.category}`
          )
        ),

        // Body Font
        React.createElement(
          View,
          { style: styles.fontDisplay },
          React.createElement(
            Text,
            { style: styles.fontName },
            `Body Font: ${brandKit.typography.bodyFont.family}`
          ),
          React.createElement(
            Text,
            { style: [styles.fontSample, { fontSize: 16 }] },
            'The quick brown fox jumps over'
          ),
          React.createElement(
            Text,
            { style: styles.paragraph },
            `Category: ${brandKit.typography.bodyFont.category}`
          )
        ),

        // Type Scale
        React.createElement(
          Text,
          { style: styles.sectionSubtitle },
          `Type Scale (${brandKit.typography.scale.ratioName})`
        ),
        ...brandKit.typography.scale.sizes.slice(0, 6).map((size) =>
          React.createElement(
            View,
            { key: size.name, style: styles.typescaleRow },
            React.createElement(Text, { style: styles.typescaleLabel }, size.name),
            React.createElement(Text, { style: styles.typescaleSize }, `${size.size}px`),
            React.createElement(
              Text,
              { style: { fontSize: Math.min(size.size, 24) } },
              'Sample'
            )
          )
        )
      ),
      React.createElement(Text, { style: styles.footer }, 'Brand Kit Generator')
    ),

    // Brand Voice Page
    React.createElement(
      Page,
      { size: 'A4', style: styles.page },
      React.createElement(
        View,
        { style: styles.section },
        React.createElement(Text, { style: styles.sectionTitle }, 'Brand Voice'),

        // Archetype
        React.createElement(
          View,
          { style: styles.voiceCard },
          React.createElement(
            Text,
            { style: styles.voicePrinciple },
            `Archetype: ${brandKit.personality.archetype.primary}`
          ),
          React.createElement(
            Text,
            { style: styles.voiceDescription },
            brandKit.personality.archetype.description
          ),
          React.createElement(
            Text,
            { style: { fontSize: 10, color: '#6b7280', marginTop: 8 } },
            `Traits: ${brandKit.personality.archetype.traits.join(', ')}`
          )
        ),

        // Tone Description
        React.createElement(Text, { style: styles.sectionSubtitle }, 'Tone'),
        React.createElement(Text, { style: styles.paragraph }, brandKit.voice.toneDescription),

        // Voice Principles
        React.createElement(Text, { style: styles.sectionSubtitle }, 'Voice Principles'),
        ...brandKit.voice.principles.slice(0, 3).map((principle, i) =>
          React.createElement(
            View,
            { key: `principle-${i}`, style: styles.voiceCard },
            React.createElement(Text, { style: styles.voicePrinciple }, principle.name),
            React.createElement(Text, { style: styles.voiceDescription }, principle.description),
            React.createElement(
              Text,
              { style: styles.voiceExample },
              `Example: ${principle.example}`
            )
          )
        )
      ),
      React.createElement(Text, { style: styles.footer }, 'Brand Kit Generator')
    ),

    // Vocabulary Page
    React.createElement(
      Page,
      { size: 'A4', style: styles.page },
      React.createElement(
        View,
        { style: styles.section },
        React.createElement(Text, { style: styles.sectionTitle }, 'Vocabulary'),
        React.createElement(
          Text,
          { style: styles.paragraph },
          brandKit.voice.vocabulary.description
        ),

        React.createElement(Text, { style: styles.sectionSubtitle }, 'Words to Use'),
        React.createElement(
          Text,
          { style: styles.paragraph },
          brandKit.voice.vocabulary.wordsToUse.join(', ')
        ),

        React.createElement(Text, { style: styles.sectionSubtitle }, 'Words to Avoid'),
        React.createElement(
          Text,
          { style: styles.paragraph },
          brandKit.voice.vocabulary.wordsToAvoid.join(', ')
        ),

        React.createElement(Text, { style: styles.sectionSubtitle }, 'Cadence'),
        React.createElement(Text, { style: styles.paragraph }, brandKit.voice.cadenceDescription)
      ),
      React.createElement(Text, { style: styles.footer }, 'Brand Kit Generator')
    )
  );
}

// Generate PDF buffer
export async function generateBrandGuidelinesPDF(brandKit: BrandKit): Promise<Buffer> {
  const pdfDocument = createBrandGuidelinesPDF(brandKit);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const buffer = await renderToBuffer(pdfDocument as any);
  return Buffer.from(buffer);
}
