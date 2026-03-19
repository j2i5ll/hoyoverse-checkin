const SNS_FIELDS = [
  { key: 'twitter_name', label: 'Twitter' },
  { key: 'google_name', label: 'Google' },
  { key: 'facebook_name', label: 'Facebook' },
  { key: 'apple_name', label: 'Apple' },
  { key: 'steam_name', label: 'Steam' },
  { key: 'sony_name', label: 'PlayStation' },
  { key: 'game_center_name', label: 'Game Center' },
] as const;

export function resolveDisplayName(
  accountData: Record<string, unknown>,
): string {
  const email = accountData.email;
  if (typeof email === 'string' && email.trim().length > 0) {
    return email;
  }

  for (const { key, label } of SNS_FIELDS) {
    const name = accountData[key];
    if (typeof name === 'string' && name.trim().length > 0) {
      return `${name} (${label})`;
    }
  }

  const accountId = accountData.account_id;
  if (
    accountId !== undefined &&
    accountId !== null &&
    String(accountId).length > 0
  ) {
    return `Account #${accountId}`;
  }

  return 'Unknown Account';
}
