import test from 'node:test';
import assert from 'node:assert/strict';
import { createNewIncident, createPracticeDrillIncident } from './test-helpers.mjs';

test('createNewIncident creates valid crash incident structure', () => {
  const inc = createNewIncident('crash');
  assert.ok(inc.id.startsWith('RG-'));
  assert.equal(inc.type, 'crash');
  assert.equal(inc.safetyChecklist.hazardLightsOn, false);
  assert.equal(inc.photos.length, 6);
  assert.equal(inc.towShield.refusedBlankForm, true);
  assert.equal(inc.isCompleted, false);
});

test('createPracticeDrillIncident provides complete ready-to-verify data', () => {
  const drill = createPracticeDrillIncident();
  assert.ok(drill.id.startsWith('DRILL-'));
  assert.equal(drill.safetyChecklist.hazardLightsOn, true);
  assert.equal(drill.safetyChecklist.engineOff, true);
  assert.equal(drill.safetyChecklist.behindGuardrail, true);
  assert.equal(drill.otherParty.driverName, 'Marcus Vance');
  assert.equal(drill.otherParty.licensePlate, '8XYZ419');
  assert.equal(drill.otherParty.vin, '4T1B11HK5NU109284');
  assert.ok(drill.photos.every((p) => p.dataUrl !== null));
  assert.equal(drill.towShield.companyName, 'Golden Gate Authorized Highway Towing');
  assert.equal(drill.towShield.refusedBlankForm, true);
  assert.ok(drill.statement.factualNotes.length > 20);
});

test('Safety checklist requires hazard, engine off, and guardrail for physical security', () => {
  const inc = createNewIncident('crash');
  const isSafe = (chk) => chk.hazardLightsOn && chk.engineOff && chk.behindGuardrail;

  assert.equal(isSafe(inc.safetyChecklist), false);

  inc.safetyChecklist.hazardLightsOn = true;
  inc.safetyChecklist.engineOff = true;
  assert.equal(isSafe(inc.safetyChecklist), false);

  inc.safetyChecklist.behindGuardrail = true;
  assert.equal(isSafe(inc.safetyChecklist), true);
});

test('VIN validator verifies standard 17 character length', () => {
  const drill = createPracticeDrillIncident();
  assert.equal(drill.otherParty.vin.length, 17);

  const isValidVin = (vin) => vin.trim().length === 17;
  assert.equal(isValidVin(drill.otherParty.vin), true);
  assert.equal(isValidVin('SHORTVIN123'), false);
});
