export function normalizeSupportLink(value) {
  const trimmed = String(value || '').trim();
  if (!trimmed) return '';

  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
  if (trimmed.startsWith('wa.me/')) return `https://${trimmed}`;
  if (trimmed.startsWith('t.me/')) return `https://${trimmed}`;

  const digitsOnly = trimmed.replace(/\D/g, '');
  if (/^\+?\d[\d\s-]+$/.test(trimmed) && digitsOnly.length >= 8) {
    return `https://wa.me/${digitsOnly}`;
  }

  if (trimmed.startsWith('@')) return `https://t.me/${trimmed.slice(1)}`;
  if (/whatsapp|wa\.me/i.test(trimmed)) {
    return trimmed.startsWith('http') ? trimmed : `https://${trimmed}`;
  }

  return `https://t.me/${trimmed}`;
}

export function formatSupportLinkLabel(link) {
  if (!link) return '';

  if (/wa\.me|whatsapp/i.test(link)) {
    const phone = link.match(/wa\.me\/(\d+)/)?.[1] || link.match(/phone=(\d+)/)?.[1];
    return phone ? `+${phone}` : link;
  }

  return link
    .replace(/^https?:\/\/(www\.)?(t\.me|telegram\.me)\//, '@')
    .replace(/^@/, '@');
}

export function isWhatsAppLink(link) {
  return /wa\.me|whatsapp/i.test(link || '');
}
