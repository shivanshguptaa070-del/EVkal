// Helper to return high-resolution studio car images matching reference mockups
export function getVehicleImage(model: string): string {
  const m = (model || '').toLowerCase();
  if (m.includes('nexon')) return '/assets/images/nexon_ev.jpg';
  if (m.includes('ioniq')) return '/assets/images/ioniq5_ev.jpg';
  if (m.includes('tiago')) return '/assets/images/tiago_ev.jpg';
  if (m.includes('mg') || m.includes('zs')) return '/assets/images/mg_zs_ev.jpg';
  if (m.includes('xuv')) return '/assets/images/xuv400_ev.jpg';
  if (m.includes('byd') || m.includes('atto')) return '/assets/images/byd_atto3_ev.jpg';
  return '/assets/images/nexon_ev.jpg';
}
