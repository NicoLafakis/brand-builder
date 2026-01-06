-- CreateEnum
CREATE TYPE "BrandKitStatus" AS ENUM ('PENDING', 'EXTRACTING', 'GENERATING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "StepStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED', 'SKIPPED');

-- CreateEnum
CREATE TYPE "StepType" AS ENUM ('FETCH_WEBSITE', 'EXTRACT_COLORS', 'EXTRACT_FONTS', 'EXTRACT_LOGOS', 'EXTRACT_CONTENT', 'GENERATE_PALETTE', 'GENERATE_GRADIENTS', 'GENERATE_TYPOGRAPHY', 'GENERATE_BUTTONS', 'GENERATE_HEROES', 'ANALYZE_PERSONALITY', 'GENERATE_VOICE', 'GENERATE_TOKENS', 'COMPILE_KIT');

-- CreateTable
CREATE TABLE "BrandKit" (
    "id" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "name" TEXT,
    "status" "BrandKitStatus" NOT NULL DEFAULT 'PENDING',
    "data" JSONB,
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BrandKit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GenerationStep" (
    "id" TEXT NOT NULL,
    "brandKitId" TEXT NOT NULL,
    "stepType" "StepType" NOT NULL,
    "stepOrder" INTEGER NOT NULL DEFAULT 0,
    "status" "StepStatus" NOT NULL DEFAULT 'PENDING',
    "input" JSONB,
    "output" JSONB,
    "error" TEXT,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "durationMs" INTEGER,
    "model" TEXT,
    "tokensUsed" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GenerationStep_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BrandKit_domain_idx" ON "BrandKit"("domain");

-- CreateIndex
CREATE INDEX "BrandKit_status_idx" ON "BrandKit"("status");

-- CreateIndex
CREATE INDEX "BrandKit_createdAt_idx" ON "BrandKit"("createdAt");

-- CreateIndex
CREATE INDEX "GenerationStep_brandKitId_idx" ON "GenerationStep"("brandKitId");

-- CreateIndex
CREATE INDEX "GenerationStep_status_idx" ON "GenerationStep"("status");

-- CreateIndex
CREATE UNIQUE INDEX "GenerationStep_brandKitId_stepType_key" ON "GenerationStep"("brandKitId", "stepType");

-- AddForeignKey
ALTER TABLE "GenerationStep" ADD CONSTRAINT "GenerationStep_brandKitId_fkey" FOREIGN KEY ("brandKitId") REFERENCES "BrandKit"("id") ON DELETE CASCADE ON UPDATE CASCADE;
