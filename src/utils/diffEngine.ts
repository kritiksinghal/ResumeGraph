import {
  ResumeData,
  SemanticDiffResult,
  DiffLevel1Section,
  DiffLevel2Entity,
  DiffLevel3Attribute,
  DiffLevel4SemanticMeaning
} from '../types/resume';

export function computeSemanticDiff(
  oldResume: ResumeData,
  newResume: ResumeData,
  oldBranchName = 'Source',
  newBranchName = 'Target'
): SemanticDiffResult {
  const level1: DiffLevel1Section[] = [];
  const level2: DiffLevel2Entity[] = [];
  const level3: DiffLevel3Attribute[] = [];
  const level4: DiffLevel4SemanticMeaning[] = [];

  let totalAdditions = 0;
  let totalDeletions = 0;
  let totalModifications = 0;

  // 1. Profile / Summary Check
  const oldSum = oldResume.summary?.text || '';
  const newSum = newResume.summary?.text || '';
  if (oldSum !== newSum) {
    totalModifications++;
    level1.push({
      sectionKey: 'summary',
      sectionName: 'Executive Summary',
      status: 'modified',
      changeCount: 1,
      summary: 'Summary narrative and role orientation revised'
    });
    level2.push({
      sectionKey: 'summary',
      entityId: 'summary-entity',
      title: 'Executive Summary Statement',
      status: 'modified',
      description: 'Narrative reframed with updated role focus'
    });
    level3.push({
      sectionKey: 'summary',
      entityTitle: 'Executive Summary',
      attributeName: 'Narrative Text',
      oldValue: oldSum,
      newValue: newSum,
      type: 'text'
    });

    // Semantic interpretation for Summary
    const oldKeywords: string[] = (oldSum.toLowerCase().match(/\b(distributed|systems|backend|kafka|raft|ml|machine learning|vector|transformers|go|python|api)\b/g) || []) as string[];
    const newKeywords: string[] = (newSum.toLowerCase().match(/\b(distributed|systems|backend|kafka|raft|ml|machine learning|vector|transformers|go|python|api)\b/g) || []) as string[];
    const addedKeywords = newKeywords.filter((k: string) => !oldKeywords.includes(k));
    
    level4.push({
      sectionKey: 'summary',
      interpretation: addedKeywords.length > 0
        ? `Re-oriented career positioning with enhanced emphasis on ${[...new Set(addedKeywords)].slice(0, 4).join(', ')}`
        : 'Sharpened concise impact statement and professional focus',
      confidence: 'High',
      impact: 'Strong first-impression alignment for targeted roles',
      reasoning: 'Executive summary is the primary narrative anchor for human screeners and semantic parsers.'
    });
  } else {
    level1.push({
      sectionKey: 'summary',
      sectionName: 'Executive Summary',
      status: 'unchanged',
      changeCount: 0,
      summary: 'No changes detected'
    });
  }

  // 2. Experience Check (Entity ID based)
  const oldExpMap = new Map(oldResume.experience.map(e => [e.id, e]));
  const newExpMap = new Map(newResume.experience.map(e => [e.id, e]));
  let expChanges = 0;

  // Check deleted experiences
  for (const [id, oldExp] of oldExpMap.entries()) {
    if (!newExpMap.has(id)) {
      expChanges++;
      totalDeletions++;
      level2.push({
        sectionKey: 'experience',
        entityId: id,
        title: `${oldExp.role} @ ${oldExp.company}`,
        status: 'removed',
        description: `Removed role from experience section`
      });
      level3.push({
        sectionKey: 'experience',
        entityTitle: `${oldExp.role} @ ${oldExp.company}`,
        attributeName: 'Entire Role',
        oldValue: `${oldExp.role} at ${oldExp.company} (${oldExp.startDate} - ${oldExp.endDate})`,
        newValue: '(Removed)',
        type: 'text'
      });
    }
  }

  // Check added or modified experiences
  for (const [id, newExp] of newExpMap.entries()) {
    const oldExp = oldExpMap.get(id);
    if (!oldExp) {
      expChanges++;
      totalAdditions++;
      level2.push({
        sectionKey: 'experience',
        entityId: id,
        title: `${newExp.role} @ ${newExp.company}`,
        status: 'added',
        description: `Added new professional experience entry`
      });
      level3.push({
        sectionKey: 'experience',
        entityTitle: `${newExp.role} @ ${newExp.company}`,
        attributeName: 'Entire Role',
        oldValue: '(Not present)',
        newValue: `${newExp.role} at ${newExp.company} (${newExp.bullets.length} bullet points)`,
        type: 'text'
      });
    } else {
      // Check modifications inside entity
      const bulletChanges: string[] = [];
      const addedBullets = newExp.bullets.filter(b => !oldExp.bullets.includes(b));
      const removedBullets = oldExp.bullets.filter(b => !newExp.bullets.includes(b));
      
      if (addedBullets.length > 0 || removedBullets.length > 0 || oldExp.role !== newExp.role) {
        expChanges++;
        totalModifications++;
        level2.push({
          sectionKey: 'experience',
          entityId: id,
          title: `${newExp.role} @ ${newExp.company}`,
          status: 'modified',
          description: `Updated responsibilities, accomplishments, or tech stack`
        });

        if (oldExp.role !== newExp.role) {
          level3.push({
            sectionKey: 'experience',
            entityTitle: `${newExp.company}`,
            attributeName: 'Job Title',
            oldValue: oldExp.role,
            newValue: newExp.role,
            type: 'text'
          });
        }

        addedBullets.forEach(b => {
          level3.push({
            sectionKey: 'experience',
            entityTitle: `${newExp.role} @ ${newExp.company}`,
            attributeName: 'Accomplishment Bullet (+)',
            oldValue: '(None)',
            newValue: b,
            type: 'list_item_add'
          });
        });

        removedBullets.forEach(b => {
          level3.push({
            sectionKey: 'experience',
            entityTitle: `${newExp.role} @ ${newExp.company}`,
            attributeName: 'Accomplishment Bullet (-)',
            oldValue: b,
            newValue: '(Removed)',
            type: 'list_item_remove'
          });
        });

        // Semantic check on bullets (metric quantification check)
        const hasNewMetrics = addedBullets.some(b => /\b(\d+[%kKmM]?|\$\d+|\d+ms|\d+x)\b/.test(b));
        if (hasNewMetrics) {
          level4.push({
            sectionKey: 'experience',
            interpretation: `Enhanced ${newExp.company} accomplishments with quantitative performance metrics & impact data`,
            confidence: 'High',
            impact: 'Significantly strengthens evidence of execution capability in technical screens',
            reasoning: 'Recruiters and hiring managers rank quantified metric bullets 3.2x higher than descriptive tasks.'
          });
        }
      }
    }
  }

  level1.push({
    sectionKey: 'experience',
    sectionName: 'Work Experience',
    status: expChanges > 0 ? 'modified' : 'unchanged',
    changeCount: expChanges,
    summary: expChanges > 0 ? `${expChanges} experience modification(s) detected` : 'No changes'
  });

  // 3. Projects Check
  const oldProjMap = new Map(oldResume.projects.map(p => [p.id, p]));
  const newProjMap = new Map(newResume.projects.map(p => [p.id, p]));
  let projChanges = 0;

  for (const [id, oldProj] of oldProjMap.entries()) {
    if (!newProjMap.has(id)) {
      projChanges++;
      totalDeletions++;
      level2.push({
        sectionKey: 'projects',
        entityId: id,
        title: oldProj.name,
        status: 'removed',
        description: `Removed project from resume variant`
      });
    }
  }

  for (const [id, newProj] of newProjMap.entries()) {
    const oldProj = oldProjMap.get(id);
    if (!oldProj) {
      projChanges++;
      totalAdditions++;
      level2.push({
        sectionKey: 'projects',
        entityId: id,
        title: newProj.name,
        status: 'added',
        description: `Added featured project: ${newProj.tagline}`
      });
      level3.push({
        sectionKey: 'projects',
        entityTitle: newProj.name,
        attributeName: 'New Project',
        oldValue: '(None)',
        newValue: `${newProj.name} (${newProj.techStack.join(', ')})`,
        type: 'text'
      });
    } else {
      const isModified =
        oldProj.name !== newProj.name ||
        oldProj.tagline !== newProj.tagline ||
        JSON.stringify(oldProj.bullets) !== JSON.stringify(newProj.bullets) ||
        JSON.stringify(oldProj.techStack) !== JSON.stringify(newProj.techStack);

      if (isModified) {
        projChanges++;
        totalModifications++;
        level2.push({
          sectionKey: 'projects',
          entityId: id,
          title: newProj.name,
          status: 'modified',
          description: `Updated project description, architecture details, or tech stack`
        });

        if (oldProj.tagline !== newProj.tagline) {
          level3.push({
            sectionKey: 'projects',
            entityTitle: newProj.name,
            attributeName: 'Tagline & Architecture',
            oldValue: oldProj.tagline,
            newValue: newProj.tagline,
            type: 'text'
          });
        }
      }
    }
  }

  // Check Project Ordering changes (semantic prioritization)
  if (oldResume.projects.length > 0 && newResume.projects.length > 0) {
    const oldFirst = oldResume.projects[0]?.name;
    const newFirst = newResume.projects[0]?.name;
    if (oldFirst && newFirst && oldFirst !== newFirst) {
      level4.push({
        sectionKey: 'projects',
        interpretation: `Reprioritized primary showcase project from "${oldFirst}" to "${newFirst}"`,
        confidence: 'High',
        impact: `Directly targets recruiter attention towards ${newFirst.split('—')[0].trim()}`,
        reasoning: 'The top project in the Projects section establishes immediate technical archetype and domain authority.'
      });
    }
  }

  level1.push({
    sectionKey: 'projects',
    sectionName: 'Technical Projects',
    status: projChanges > 0 ? 'modified' : 'unchanged',
    changeCount: projChanges,
    summary: projChanges > 0 ? `${projChanges} project modification(s)` : 'No changes'
  });

  // 4. Skills Section Check
  const oldSkills = oldResume.skillCategories.flatMap(c => c.skills.map(s => s.name));
  const newSkills = newResume.skillCategories.flatMap(c => c.skills.map(s => s.name));
  const addedSkillNames = newSkills.filter(s => !oldSkills.includes(s));
  const removedSkillNames = oldSkills.filter(s => !newSkills.includes(s));

  if (addedSkillNames.length > 0 || removedSkillNames.length > 0) {
    const skillChanges = addedSkillNames.length + removedSkillNames.length;
    totalAdditions += addedSkillNames.length;
    totalDeletions += removedSkillNames.length;

    level1.push({
      sectionKey: 'skills',
      sectionName: 'Technical Skills Matrix',
      status: 'modified',
      changeCount: skillChanges,
      summary: `+${addedSkillNames.length} skill(s) added, -${removedSkillNames.length} skill(s) removed`
    });

    if (addedSkillNames.length > 0) {
      level2.push({
        sectionKey: 'skills',
        entityId: 'skills-added',
        title: 'Added Technical Skills',
        status: 'added',
        description: addedSkillNames.join(', ')
      });
      level3.push({
        sectionKey: 'skills',
        entityTitle: 'Skills Matrix',
        attributeName: 'Added Skills',
        oldValue: '(None)',
        newValue: addedSkillNames.join(', '),
        type: 'tech_stack'
      });
    }

    if (removedSkillNames.length > 0) {
      level2.push({
        sectionKey: 'skills',
        entityId: 'skills-removed',
        title: 'Trimmed Technical Skills',
        status: 'removed',
        description: removedSkillNames.join(', ')
      });
      level3.push({
        sectionKey: 'skills',
        entityTitle: 'Skills Matrix',
        attributeName: 'Removed Skills',
        oldValue: removedSkillNames.join(', '),
        newValue: '(Removed)',
        type: 'tech_stack'
      });
    }

    level4.push({
      sectionKey: 'skills',
      interpretation: `Expanded keyword footprint for ${addedSkillNames.slice(0, 5).join(', ')} while streamlining irrelevant tags`,
      confidence: 'High',
      impact: 'Increases ATS parser keyword density and semantic match thresholds',
      reasoning: 'Skills matrix feeds automated ATS extraction tokens.'
    });
  } else {
    level1.push({
      sectionKey: 'skills',
      sectionName: 'Technical Skills Matrix',
      status: 'unchanged',
      changeCount: 0,
      summary: 'Skills match identically'
    });
  }

  // Calculate semantic shift score (0-100)
  const shiftRaw = (totalAdditions * 6) + (totalDeletions * 5) + (totalModifications * 12) + (level4.length * 15);
  const semanticShiftScore = Math.min(100, Math.max(0, shiftRaw));

  return {
    fromVersionId: oldResume.versionId || 'v-source',
    toVersionId: newResume.versionId || 'v-target',
    fromBranchName: oldBranchName,
    toBranchName: newBranchName,
    level1_sections: level1,
    level2_entities: level2,
    level3_attributes: level3,
    level4_semanticMeaning: level4,
    stats: {
      totalAdditions,
      totalDeletions,
      totalModifications,
      semanticShiftScore
    }
  };
}
