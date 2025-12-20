// src/constants/venueEnums.js

export const VenueType = {
  CAFE: 'CAFE',
  GAME_STORE: 'GAME_STORE',
  COMMUNITY_CENTER: 'COMMUNITY_CENTER',
  LIBRARY: 'LIBRARY',
  OTHER: 'OTHER',
};

export const VenueTypeLabels = {
  [VenueType.CAFE]: 'Kafe',
  [VenueType.GAME_STORE]: 'Oyun Mağazası',
  [VenueType.COMMUNITY_CENTER]: 'Topluluk Merkezi',
  [VenueType.LIBRARY]: 'Kütüphane',
  [VenueType.OTHER]: 'Diğer',
};

// GÜNCELLENDİ: Backend VenueStatus ile uyumlu
export const VenueStatus = {
  PENDING_APPROVAL: 'PENDING_APPROVAL',
  PUBLISHED: 'PUBLISHED',     // Eski ACTIVE yerine
  CLAIM_PENDING: 'CLAIM_PENDING',
  CLOSED: 'CLOSED',
  REJECTED: 'REJECTED'
};

export const VenueStatusLabels = {
  [VenueStatus.PENDING_APPROVAL]: 'Onay Bekliyor',
  [VenueStatus.PUBLISHED]: 'Yayında',
  [VenueStatus.CLAIM_PENDING]: 'Sahiplenme Bekleniyor',
  [VenueStatus.CLOSED]: 'Kapalı',
  [VenueStatus.REJECTED]: 'Reddedildi'
};