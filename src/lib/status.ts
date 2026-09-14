import type { LampColour } from '../components/Lamp.astro';
import type { DECISION_STATUSES, PROJECT_STATUSES } from '../content.config';

export const projectLamp: Record<(typeof PROJECT_STATUSES)[number], LampColour> = {
	active: 'green',
	paused: 'amber',
	planned: 'off',
	done: 'white',
};

export const decisionLamp: Record<(typeof DECISION_STATUSES)[number], LampColour> = {
	accepted: 'green',
	proposed: 'amber',
	superseded: 'red',
};
