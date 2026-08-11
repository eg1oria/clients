export type LeadSegment =
  | 'basic_wardrobe'
  | 'personal_style'
  | 'personal_consultation';

export type LandingLead = {
  name: string;
  contact: string;
  source: 'landing';
  segment: LeadSegment;
  funnelStage: 'lead_magnet';
  product: '7_wardrobe_mistakes';
};

export type LeadSubmissionResult = {
  status: 'accepted';
  acceptedAt: string;
  lead: LandingLead;
};

/**
 * Demo integration boundary for the commercial landing page.
 *
 * TODO(integration): replace the local resolver with POST to a same-origin
 * route handler. That handler will validate the payload again and forward it
 * to the protected n8n webhook. The webhook URL must never be exposed here.
 */
export function submitPrimerkaLead(lead: LandingLead): Promise<LeadSubmissionResult> {
  return Promise.resolve({
    status: 'accepted',
    acceptedAt: new Date().toISOString(),
    lead,
  });
}
