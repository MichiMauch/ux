import { CHECK_DEFINITIONS } from './checks/check-definitions';

/**
 * Berechnet die maximal erreichbare Punktzahl, indem die Punkte aller definierten Checks summiert werden.
 * @returns Die maximale Gesamtpunktzahl.
 */
function calculateMaxScore(): number {
  return Object.values(CHECK_DEFINITIONS).reduce((total, check) => total + check.points, 0);
}

export const MAX_SCORE = calculateMaxScore();
