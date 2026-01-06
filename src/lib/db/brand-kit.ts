/**
 * Brand Kit Database Operations
 *
 * Handles creation, retrieval, and updates of brand kits
 * with their associated generation steps.
 */

import { prisma } from './client';
import { BrandKitStatus, StepType, StepStatus, Prisma } from '@prisma/client';
import type { BrandKit as BrandKitType } from '../types/brand';

// Step execution order for the generation pipeline
export const STEP_ORDER: StepType[] = [
  'FETCH_WEBSITE',
  'EXTRACT_COLORS',
  'EXTRACT_FONTS',
  'EXTRACT_LOGOS',
  'EXTRACT_CONTENT',
  'GENERATE_PALETTE',
  'GENERATE_GRADIENTS',
  'GENERATE_TYPOGRAPHY',
  'GENERATE_BUTTONS',
  'GENERATE_HEROES',
  'ANALYZE_PERSONALITY',
  'GENERATE_VOICE',
  'GENERATE_TOKENS',
  'COMPILE_KIT',
];

/**
 * Create a new brand kit with all generation steps initialized
 */
export async function createBrandKit(domain: string) {
  const brandKit = await prisma.brandKit.create({
    data: {
      domain,
      status: 'PENDING',
      steps: {
        create: STEP_ORDER.map((stepType, index) => ({
          stepType,
          stepOrder: index,
          status: 'PENDING',
        })),
      },
    },
    include: {
      steps: {
        orderBy: { stepOrder: 'asc' },
      },
    },
  });

  return brandKit;
}

/**
 * Get a brand kit by ID with all steps
 */
export async function getBrandKit(id: string) {
  return prisma.brandKit.findUnique({
    where: { id },
    include: {
      steps: {
        orderBy: { stepOrder: 'asc' },
      },
    },
  });
}

/**
 * Get a brand kit by domain (returns most recent)
 */
export async function getBrandKitByDomain(domain: string) {
  return prisma.brandKit.findFirst({
    where: { domain },
    orderBy: { createdAt: 'desc' },
    include: {
      steps: {
        orderBy: { stepOrder: 'asc' },
      },
    },
  });
}

/**
 * Update brand kit status
 */
export async function updateBrandKitStatus(
  id: string,
  status: BrandKitStatus,
  error?: string
) {
  return prisma.brandKit.update({
    where: { id },
    data: {
      status,
      error,
    },
  });
}

/**
 * Save the final compiled brand kit data
 */
export async function saveBrandKitData(
  id: string,
  name: string,
  data: BrandKitType
) {
  return prisma.brandKit.update({
    where: { id },
    data: {
      name,
      status: 'COMPLETED',
      data: data as unknown as Prisma.InputJsonValue,
    },
  });
}

/**
 * Get the next pending step for a brand kit
 */
export async function getNextPendingStep(brandKitId: string) {
  return prisma.generationStep.findFirst({
    where: {
      brandKitId,
      status: 'PENDING',
    },
    orderBy: { stepOrder: 'asc' },
  });
}

/**
 * Get all completed steps with their output data
 */
export async function getCompletedStepsData(brandKitId: string) {
  const steps = await prisma.generationStep.findMany({
    where: {
      brandKitId,
      status: 'COMPLETED',
    },
    orderBy: { stepOrder: 'asc' },
  });

  // Convert to a map of stepType -> output data
  const data: Partial<Record<StepType, unknown>> = {};
  for (const step of steps) {
    data[step.stepType] = step.output;
  }
  return data;
}

/**
 * Start a generation step
 */
export async function startStep(brandKitId: string, stepType: StepType, input?: unknown) {
  return prisma.generationStep.update({
    where: {
      brandKitId_stepType: { brandKitId, stepType },
    },
    data: {
      status: 'IN_PROGRESS',
      startedAt: new Date(),
      input: input as Prisma.InputJsonValue,
      attempts: { increment: 1 },
    },
  });
}

/**
 * Complete a generation step with output data
 */
export async function completeStep(
  brandKitId: string,
  stepType: StepType,
  output: unknown,
  model?: string,
  tokensUsed?: number
) {
  const step = await prisma.generationStep.findUnique({
    where: {
      brandKitId_stepType: { brandKitId, stepType },
    },
  });

  const durationMs = step?.startedAt
    ? Date.now() - step.startedAt.getTime()
    : null;

  return prisma.generationStep.update({
    where: {
      brandKitId_stepType: { brandKitId, stepType },
    },
    data: {
      status: 'COMPLETED',
      completedAt: new Date(),
      output: output as Prisma.InputJsonValue,
      durationMs,
      model,
      tokensUsed,
      error: null,
    },
  });
}

/**
 * Fail a generation step with error
 */
export async function failStep(
  brandKitId: string,
  stepType: StepType,
  error: string
) {
  return prisma.generationStep.update({
    where: {
      brandKitId_stepType: { brandKitId, stepType },
    },
    data: {
      status: 'FAILED',
      completedAt: new Date(),
      error,
    },
  });
}

/**
 * Skip a generation step
 */
export async function skipStep(brandKitId: string, stepType: StepType, reason?: string) {
  return prisma.generationStep.update({
    where: {
      brandKitId_stepType: { brandKitId, stepType },
    },
    data: {
      status: 'SKIPPED',
      completedAt: new Date(),
      error: reason,
    },
  });
}

/**
 * Reset a failed step to pending (for retries)
 */
export async function resetStep(brandKitId: string, stepType: StepType) {
  return prisma.generationStep.update({
    where: {
      brandKitId_stepType: { brandKitId, stepType },
    },
    data: {
      status: 'PENDING',
      startedAt: null,
      completedAt: null,
      output: Prisma.DbNull,
      error: null,
      durationMs: null,
    },
  });
}

/**
 * Get generation progress stats
 */
export async function getProgress(brandKitId: string) {
  const steps = await prisma.generationStep.findMany({
    where: { brandKitId },
    select: { status: true, stepType: true },
  });

  const total = steps.length;
  const completed = steps.filter(s => s.status === 'COMPLETED').length;
  const failed = steps.filter(s => s.status === 'FAILED').length;
  const inProgress = steps.filter(s => s.status === 'IN_PROGRESS').length;
  const pending = steps.filter(s => s.status === 'PENDING').length;
  const skipped = steps.filter(s => s.status === 'SKIPPED').length;

  const currentStep = steps.find(s => s.status === 'IN_PROGRESS')?.stepType
    || steps.find(s => s.status === 'PENDING')?.stepType;

  return {
    total,
    completed,
    failed,
    inProgress,
    pending,
    skipped,
    currentStep,
    percentComplete: Math.round((completed / total) * 100),
    isComplete: completed + skipped === total,
    hasFailed: failed > 0,
  };
}

/**
 * List recent brand kits
 */
export async function listBrandKits(limit = 20) {
  return prisma.brandKit.findMany({
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: {
      steps: {
        select: { status: true },
      },
    },
  });
}

// Re-export types for convenience
export { BrandKitStatus, StepType, StepStatus };
