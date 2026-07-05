export function getReferralLink(code) {
  if (!code) return '';
  return `${window.location.origin}/register?ref=${encodeURIComponent(code)}`;
}

export function getReferralShareText(code) {
  const link = getReferralLink(code);
  if (!link) return '';
  return `Join Crypto Stacker with my referral link:\n${link}`;
}
