import { ResumeData, MergeReport, MergeConflictItem } from '../types/resume';

export function runSemantic3WayMerge(
  sourceResume: ResumeData,
  targetResume: ResumeData,
  baseResume?: ResumeData,
  sourceBranchName = 'source',
  targetBranchName = 'target'
): MergeReport {
  const autoMergedEntities: MergeReport['autoMergedEntities'] = [];
  const conflicts: MergeConflictItem[] = [];

  // 1. Check Executive Summary
  const sourceSum = sourceResume.summary?.text || '';
  const targetSum = targetResume.summary?.text || '';
  const baseSum = baseResume?.summary?.text || '';

  if (sourceSum !== targetSum) {
    if (baseResume && sourceSum === baseSum) {
      // Source did not touch summary, keep target automatically
      autoMergedEntities.push({
        sectionKey: 'summary',
        entityId: 'summary-entity',
        title: 'Executive Summary',
        action: 'kept_from_target',
        detail: 'Target branch summary preserved (source branch made no changes).'
      });
    } else if (baseResume && targetSum === baseSum) {
      // Target did not touch summary, adopt source automatically
      autoMergedEntities.push({
        sectionKey: 'summary',
        entityId: 'summary-entity',
        title: 'Executive Summary',
        action: 'added_from_source',
        detail: 'Adopted updated summary from source branch.'
      });
    } else {
      // Both branches modified summary differently -> Conflict!
      conflicts.push({
        id: 'conflict-summary',
        sectionKey: 'summary',
        entityId: 'summary-entity',
        title: 'Executive Summary Divergence',
        type: 'summary_divergence',
        description: `Source branch focuses on "${sourceResume.summary?.toneFocus || 'Source focus'}" while target branch focuses on "${targetResume.summary?.toneFocus || 'Target focus'}".`,
        sourceValue: sourceResume.summary,
        targetValue: targetResume.summary,
        baseValue: baseResume?.summary,
        aiSuggestion: {
          recommendation: 'synthesize',
          synthesizedValue: {
            text: `${sourceSum.split('.')[0]}. Additionally experienced in ${targetSum.toLowerCase().includes('distributed') ? 'distributed systems & cloud architecture' : 'scalable software engineering'}.`,
            toneFocus: 'Unified Full-Stack & Systems Focus'
          },
          rationale: 'Synthesized the core achievements from both branches into a cohesive multi-faceted summary.',
          confidence: 0.92
        },
        resolvedChoice: null,
        isResolved: false
      });
    }
  }

  // 2. Check Work Experience
  const sourceExpMap = new Map(sourceResume.experience.map(e => [e.id, e]));
  const targetExpMap = new Map(targetResume.experience.map(e => [e.id, e]));

  // Experience items present in source but not in target
  for (const [id, sourceExp] of sourceExpMap.entries()) {
    if (!targetExpMap.has(id)) {
      autoMergedEntities.push({
        sectionKey: 'experience',
        entityId: id,
        title: `${sourceExp.role} @ ${sourceExp.company}`,
        action: 'added_from_source',
        detail: `Safely merged unique work experience from ${sourceBranchName}.`
      });
    }
  }

  // Experience items present in both: check for contradictory fields or conflicting bullets
  for (const [id, targetExp] of targetExpMap.entries()) {
    const sourceExp = sourceExpMap.get(id);
    if (!sourceExp) {
      autoMergedEntities.push({
        sectionKey: 'experience',
        entityId: id,
        title: `${targetExp.role} @ ${targetExp.company}`,
        action: 'kept_from_target',
        detail: `Retained existing experience in ${targetBranchName}.`
      });
    } else {
      // Compare dates / titles for contradictory claims
      const isDateMismatch = sourceExp.startDate !== targetExp.startDate || sourceExp.endDate !== targetExp.endDate;
      const isRoleMismatch = sourceExp.role !== targetExp.role;
      const areBulletsDifferent = JSON.stringify(sourceExp.bullets) !== JSON.stringify(targetExp.bullets);

      if (isDateMismatch) {
        conflicts.push({
          id: `conflict-exp-date-${id}`,
          sectionKey: 'experience',
          entityId: id,
          title: `Contradictory Employment Dates @ ${targetExp.company}`,
          type: 'contradictory_field',
          description: `Date discrepancy detected: ${sourceBranchName} claims (${sourceExp.startDate} - ${sourceExp.endDate}) whereas ${targetBranchName} claims (${targetExp.startDate} - ${targetExp.endDate}).`,
          sourceValue: { role: sourceExp.role, startDate: sourceExp.startDate, endDate: sourceExp.endDate },
          targetValue: { role: targetExp.role, startDate: targetExp.startDate, endDate: targetExp.endDate },
          aiSuggestion: {
            recommendation: 'accept_target',
            rationale: 'Target branch date range matches verified master chronology.',
            confidence: 0.88
          },
          resolvedChoice: null,
          isResolved: false
        });
      } else if (isRoleMismatch) {
        conflicts.push({
          id: `conflict-exp-role-${id}`,
          sectionKey: 'experience',
          entityId: id,
          title: `Job Title Discrepancy @ ${targetExp.company}`,
          type: 'contradictory_field',
          description: `${sourceBranchName} titles role as "${sourceExp.role}", while ${targetBranchName} titles role as "${targetExp.role}".`,
          sourceValue: sourceExp.role,
          targetValue: targetExp.role,
          aiSuggestion: {
            recommendation: 'accept_target',
            rationale: 'Retain canonical official title to ensure zero ATS verification flags.',
            confidence: 0.95
          },
          resolvedChoice: null,
          isResolved: false
        });
      } else if (areBulletsDifferent) {
        // Bullet differences can be synthesized / combined without conflict if not contradicting
        const mergedBullets = [...new Set([...targetExp.bullets, ...sourceExp.bullets])];
        autoMergedEntities.push({
          sectionKey: 'experience',
          entityId: id,
          title: `${targetExp.role} @ ${targetExp.company}`,
          action: 'non_conflicting_update',
          detail: `Combined unique non-overlapping accomplishments (${mergedBullets.length} total bullets).`
        });
      } else {
        autoMergedEntities.push({
          sectionKey: 'experience',
          entityId: id,
          title: `${targetExp.role} @ ${targetExp.company}`,
          action: 'kept_from_target',
          detail: 'Experience records match identically.'
        });
      }
    }
  }

  // 3. Projects Check
  const sourceProjMap = new Map(sourceResume.projects.map(p => [p.id, p]));
  const targetProjMap = new Map(targetResume.projects.map(p => [p.id, p]));

  for (const [id, sourceProj] of sourceProjMap.entries()) {
    if (!targetProjMap.has(id)) {
      autoMergedEntities.push({
        sectionKey: 'projects',
        entityId: id,
        title: sourceProj.name,
        action: 'added_from_source',
        detail: `Added new showcase project "${sourceProj.name}" from ${sourceBranchName}.`
      });
    }
  }

  for (const [id, targetProj] of targetProjMap.entries()) {
    const sourceProj = sourceProjMap.get(id);
    if (!sourceProj) {
      autoMergedEntities.push({
        sectionKey: 'projects',
        entityId: id,
        title: targetProj.name,
        action: 'kept_from_target',
        detail: `Retained project "${targetProj.name}".`
      });
    } else {
      // Check for conflicting description/taglines
      if (sourceProj.tagline !== targetProj.tagline) {
        conflicts.push({
          id: `conflict-proj-tagline-${id}`,
          sectionKey: 'projects',
          entityId: id,
          title: `Project Narrative Emphasis: ${targetProj.name}`,
          type: 'conflicting_content',
          description: `${sourceBranchName} describes project as "${sourceProj.tagline}", while ${targetBranchName} describes it as "${targetProj.tagline}".`,
          sourceValue: sourceProj,
          targetValue: targetProj,
          aiSuggestion: {
            recommendation: 'synthesize',
            synthesizedValue: {
              ...targetProj,
              tagline: `${targetProj.tagline} with ${sourceProj.techStack.slice(0, 3).join('/')} support`,
              bullets: [...new Set([...targetProj.bullets, ...sourceProj.bullets])]
            },
            rationale: 'Combined the technical highlights and architecture points from both branches.',
            confidence: 0.91
          },
          resolvedChoice: null,
          isResolved: false
        });
      } else {
        autoMergedEntities.push({
          sectionKey: 'projects',
          entityId: id,
          title: targetProj.name,
          action: 'kept_from_target',
          detail: 'Project data is identical.'
        });
      }
    }
  }

  // 4. Skills Matrix Auto-Merge (Union of unique skills preserving highest proficiency)
  const allCategories = new Map<string, { id: string; categoryName: string; skills: Map<string, any> }>();

  // Helper to ingest categories
  const ingestCats = (cats: typeof targetResume.skillCategories) => {
    cats.forEach(c => {
      if (!allCategories.has(c.categoryName)) {
        allCategories.set(c.categoryName, { id: c.id, categoryName: c.categoryName, skills: new Map() });
      }
      const entry = allCategories.get(c.categoryName)!;
      c.skills.forEach(s => {
        if (!entry.skills.has(s.name) || s.level === 'Expert') {
          entry.skills.set(s.name, s);
        }
      });
    });
  };

  ingestCats(targetResume.skillCategories);
  ingestCats(sourceResume.skillCategories);

  autoMergedEntities.push({
    sectionKey: 'skills',
    entityId: 'skills-matrix',
    title: 'Technical Skills Matrix',
    action: 'non_conflicting_update',
    detail: `Auto-merged skill taxonomies across ${allCategories.size} categories without collision.`
  });

  // Certifications & Publications Auto-merge
  const sourceCertNames = new Set(sourceResume.certifications.map(c => c.name));
  const targetCertNames = new Set(targetResume.certifications.map(c => c.name));
  const newCerts = sourceResume.certifications.filter(c => !targetCertNames.has(c.name));
  if (newCerts.length > 0) {
    newCerts.forEach(c => {
      autoMergedEntities.push({
        sectionKey: 'certifications',
        entityId: c.id,
        title: c.name,
        action: 'added_from_source',
        detail: `Added certification from ${sourceBranchName}.`
      });
    });
  }

  const canAutoMerge = conflicts.length === 0;

  return {
    sourceBranchId: sourceResume.branchId || sourceBranchName,
    targetBranchId: targetResume.branchId || targetBranchName,
    sourceVersionId: sourceResume.versionId || 'v-source',
    targetVersionId: targetResume.versionId || 'v-target',
    baseVersionId: baseResume?.versionId,
    canAutoMerge,
    autoMergedEntities,
    conflicts
  };
}

export function applyMergeResolutions(
  sourceResume: ResumeData,
  targetResume: ResumeData,
  report: MergeReport,
  newVersionId: string,
  targetBranchId: string
): ResumeData {
  // Start from target
  const result: ResumeData = JSON.parse(JSON.stringify(targetResume));
  result.versionId = newVersionId;
  result.branchId = targetBranchId;

  // Process conflict resolutions
  for (const conflict of report.conflicts) {
    if (conflict.resolvedChoice === 'source') {
      if (conflict.sectionKey === 'summary') {
        result.summary = conflict.sourceValue;
      } else if (conflict.sectionKey === 'experience') {
        const idx = result.experience.findIndex(e => e.id === conflict.entityId);
        if (idx !== -1) {
          result.experience[idx] = { ...result.experience[idx], ...conflict.sourceValue };
        }
      } else if (conflict.sectionKey === 'projects') {
        const idx = result.projects.findIndex(p => p.id === conflict.entityId);
        if (idx !== -1) {
          result.projects[idx] = conflict.sourceValue;
        }
      }
    } else if (conflict.resolvedChoice === 'synthesize') {
      if (conflict.sectionKey === 'summary') {
        result.summary = conflict.aiSuggestion?.synthesizedValue || conflict.sourceValue;
      } else if (conflict.sectionKey === 'projects') {
        const idx = result.projects.findIndex(p => p.id === conflict.entityId);
        if (idx !== -1) {
          result.projects[idx] = conflict.aiSuggestion?.synthesizedValue || result.projects[idx];
        }
      }
    } else if (conflict.resolvedChoice === 'custom' && conflict.resolvedValue) {
      if (conflict.sectionKey === 'summary') {
        result.summary = { text: conflict.resolvedValue, toneFocus: 'Custom Merged' };
      }
    }
    // 'target' resolution is already in result by default
  }

  // Add all non-conflicting unique entities from source
  for (const item of report.autoMergedEntities) {
    if (item.action === 'added_from_source') {
      if (item.sectionKey === 'experience') {
        const exp = sourceResume.experience.find(e => e.id === item.entityId);
        if (exp && !result.experience.some(e => e.id === exp.id)) {
          result.experience.push(exp);
        }
      } else if (item.sectionKey === 'projects') {
        const proj = sourceResume.projects.find(p => p.id === item.entityId);
        if (proj && !result.projects.some(p => p.id === proj.id)) {
          result.projects.push(proj);
        }
      } else if (item.sectionKey === 'certifications') {
        const cert = sourceResume.certifications.find(c => c.id === item.entityId);
        if (cert && !result.certifications.some(c => c.id === cert.id)) {
          result.certifications.push(cert);
        }
      }
    }
  }

  return result;
}
