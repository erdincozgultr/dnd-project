export const WEAPON_PROPERTIES = {
  
  'Mühimmat': {
    name: 'Mühimmat',
    desc: 'Bu silahla menzilli saldırı yapmak için mühimmata ihtiyacınız var. Her saldırıda bir mühimmat harcanır. Mühimmatı çekmek saldırının bir parçasıdır. Savaş sonunda, bir dakika arayarak harcanan mühimmatın yarısını geri alabilirsiniz.'
  },
  'Teknik': {
    name: 'Teknik',
    desc: 'Bu silahla saldırı ve hasar zarları için Kuvvet veya Çeviklik değiştiricinizi kullanabilirsiniz (ikisinden birini seçin).'
  },
  'Ağır': {
    name: 'Ağır',
    desc: 'Küçük yaratıklar bu silahla saldırı zarlarında dezavantaj alır.'
  },
   'İncelik': {
    name: 'İncelik',
    desc: 'Saldırı ve hasar zarlarını belirlerken, Güç veya Çeviklik değiştiricinizden hangisi daha yüksekse onu kullanabilirsin.'
  },
  'Hafif': {
    name: 'Hafif',
    desc: 'Hafif silahlar küçük ve kullanımı kolaydır, bu da onları çift silah dövüşü için ideal kılar.'
  },
  'Doldurma': {
    name: 'Doldurma',
    desc: 'Mühimmat gerektiren bu silah, her saldırı arasında doldurulmalıdır. Bir tur içinde bu silahla yalnızca bir saldırı yapabilirsiniz.'
  },
  'Menzil': {
    name: 'Menzil',
    desc: 'Menzilli saldırı yapabilen bir silah. Normal menzil içindeki hedeflere normal saldırı, uzun menzil içindeki hedeflere dezavantajlı saldırı yapılır.'
  },
  'Erişim': {
    name: 'Erişim',
    desc: 'Bu silah, saldırırken erişiminize 1,5 metre (5 feet) ekler.'
  },
  'Özel': {
    name: 'Özel',
    desc: 'Bu silahın özel kullanım kuralları vardır.'
  },
  'Fırlatılabilir': {
    name: 'Fırlatılabilir',
    desc: 'Bu silahı fırlatarak menzilli saldırı yapabilirsiniz. Yakın dövüş silahı ise, yakın dövüş saldırısında kullandığınız yetenek değiştiricisini kullanırsınız.'
  },
  'Çift Elli': {
    name: 'Çift Elli',
    desc: 'Bu silahla saldırı yapmak için iki el gerekir.'
  },
  'Çok Yönlü': {
    name: 'Çok Yönlü',
    desc: 'Bu silah tek veya çift elle kullanılabilir. Çift elle kullanıldığında parantez içindeki hasar zarını kullanın.'
  },
  'Gümüşlü': {
    name: 'Gümüşlü',
    desc: 'Bazı canavarlar gümüşlü silahlardan gelen hasara karşı savunmasızdır.'
  },
  'Büyülü': {
    name: 'Büyülü',
    desc: 'Bu silah büyülü kabul edilir ve büyülü olmayan saldırılara dirençli yaratıklara hasar verebilir.'
  },
  
  'Monk': {
    name: 'Keşiş Silahı',
    desc: 'Keşişler bu silahı Dövüş Sanatları özelliği ile kullanabilir.'
  },
  'Mızrak': {
    name: 'Mızrak',
    desc: 'Binek üzerinde değilken bu silahla saldırıda dezavantaj alırsınız. Tek elle kullanıldığında çift elli özelliği vardır.'
  },
  'Ağ': {
    name: 'Ağ',
    desc: 'Büyük veya daha küçük yaratıklar ağa yakalandığında kısıtlanır. DC 10 Kuvvet kontrolü veya 5 kesici hasar ile kurtulabilirler.'
  }
};

export const DAMAGE_TYPES = {
  'Bludgeoning': { name: 'Ezici', desc: 'Küt kuvvet hasarı - çekiçler, topuzlar' },
  'Piercing': { name: 'Delici', desc: 'Sivri uçlu hasar - oklar, mızraklar' },
  'Slashing': { name: 'Kesici', desc: 'Keskin kenarlı hasar - kılıçlar, baltalar' },
  'Fire': { name: 'Ateş', desc: 'Yanma hasarı' },
  'Cold': { name: 'Soğuk', desc: 'Dondurucu hasar' },
  'Lightning': { name: 'Yıldırım', desc: 'Elektrik hasarı' },
  'Thunder': { name: 'Gök Gürültüsü', desc: 'Ses dalgası hasarı' },
  'Acid': { name: 'Asit', desc: 'Aşındırıcı hasar' },
  'Poison': { name: 'Zehir', desc: 'Toksik hasar' },
  'Necrotic': { name: 'Nekrotik', desc: 'Yaşam enerjisi hasarı' },
  'Radiant': { name: 'Işıltılı', desc: 'Kutsal ışık hasarı' },
  'Psychic': { name: 'Psişik', desc: 'Zihinsel hasar' },
  'Force': { name: 'Güç', desc: 'Saf büyülü enerji hasarı' }
};

export const ARMOR_CATEGORIES = {
  'Light': { name: 'Hafif Zırh', desc: 'Çeviklik bonusunun tamamı AC\'ye eklenir.' },
  'Medium': { name: 'Orta Zırh', desc: 'Çeviklik bonusunun maksimum +2\'si AC\'ye eklenir.' },
  'Heavy': { name: 'Ağır Zırh', desc: 'Çeviklik bonusu AC\'ye eklenmez. Güç gereksinimi olabilir.' },
  'Shield': { name: 'Kalkan', desc: 'AC\'ye +2 bonus sağlar.' }
};

export const ARMOR_PROPERTIES = {
  'Stealth Disadvantage': {
    name: 'Gizlilik Dezavantajı',
    desc: 'Bu zırhı giyerken Gizlilik (Stealth) kontrollerinde dezavantaj alırsınız.'
  },
  'Strength Requirement': {
    name: 'Güç Gereksinimi',
    desc: 'Bu zırhı giymek için belirtilen Güç puanına sahip olmalısınız, aksi halde hızınız 3 metre (10 feet) düşer.'
  }
};

export const ABILITIES = {
  'Strength': { name: 'Kuvvet', abbr: 'KUV' },
  'Dexterity': { name: 'Çeviklik', abbr: 'ÇEV' },
  'Constitution': { name: 'Dayanıklılık', abbr: 'DAY' },
  'Intelligence': { name: 'Zeka', abbr: 'ZEK' },
  'Wisdom': { name: 'Bilgelik', abbr: 'BİL' },
  'Charisma': { name: 'Karizma', abbr: 'KAR' }
};

export const SPELL_SCHOOLS = {
  'Abjuration': { name: 'Koruma', desc: 'Koruyucu büyüler' },
  'Conjuration': { name: 'Çağırma', desc: 'Yaratıkları veya nesneleri çağırır' },
  'Divination': { name: 'Kehanet', desc: 'Bilgi ve öngörü büyüleri' },
  'Enchantment': { name: 'Büyüleme', desc: 'Zihin etkileyen büyüler' },
  'Evocation': { name: 'Çağrışım', desc: 'Enerji manipülasyonu büyüleri' },
  'Illusion': { name: 'Yanılsama', desc: 'Duyuları aldatan büyüler' },
  'Necromancy': { name: 'Ölüm Büyüsü', desc: 'Yaşam ve ölüm enerjisi büyüleri' },
  'Transmutation': { name: 'Dönüşüm', desc: 'Madde ve enerji dönüştürme büyüleri' }
};

/**
 * Silah özelliğini Türkçeye çevir
 * @param {string} propertyName - İngilizce özellik adı
 * @returns {{ name: string, desc: string } | null}
 */
export const getWeaponProperty = (propertyName) => {
  if (!propertyName) return null;
  
  // Direkt eşleşme
  if (WEAPON_PROPERTIES[propertyName]) {
    return WEAPON_PROPERTIES[propertyName];
  }
  
  // Case-insensitive arama
  const key = Object.keys(WEAPON_PROPERTIES).find(
    k => k.toLowerCase() === propertyName.toLowerCase()
  );
  
  return key ? WEAPON_PROPERTIES[key] : null;
};

/**
 * Hasar tipini Türkçeye çevir
 * @param {string} damageType - İngilizce hasar tipi
 * @returns {string} Türkçe hasar tipi
 */
export const getDamageTypeName = (damageType) => {
  if (!damageType) return 'Bilinmiyor';
  
  const type = DAMAGE_TYPES[damageType] || 
               DAMAGE_TYPES[Object.keys(DAMAGE_TYPES).find(
                 k => k.toLowerCase() === damageType.toLowerCase()
               )];
  
  return type?.name || damageType;
};

/**
 * Zırh kategorisini Türkçeye çevir
 * @param {string} category - İngilizce kategori
 * @returns {string} Türkçe kategori
 */
export const getArmorCategoryName = (category) => {
  if (!category) return 'Zırh';
  
  const cat = ARMOR_CATEGORIES[category] ||
              ARMOR_CATEGORIES[Object.keys(ARMOR_CATEGORIES).find(
                k => k.toLowerCase() === category.toLowerCase()
              )];
  
  return cat?.name || category;
};

/**
 * Büyü okulunu Türkçeye çevir
 * @param {string} school - İngilizce okul adı
 * @returns {{ name: string, desc: string } | null}
 */
export const getSpellSchool = (school) => {
  if (!school) return null;
  
  const sch = SPELL_SCHOOLS[school] ||
              SPELL_SCHOOLS[Object.keys(SPELL_SCHOOLS).find(
                k => k.toLowerCase() === school.toLowerCase()
              )];
  
  return sch || { name: school, desc: '' };
};

/**
 * Özellik string'ini parse et ve Türkçe karşılıklarını bul
 * Örnek: "Mühimmat (Menzil 30/120), Ağır, Doldurma" -> array of {name, desc}
 * @param {string} propertiesString - Virgülle ayrılmış özellikler
 * @returns {Array<{ name: string, desc: string, original: string }>}
 */
export const parseWeaponProperties = (propertiesString) => {
  if (!propertiesString) return [];
  
  return propertiesString.split(',').map(prop => {
    const trimmed = prop.trim();
    
    // Parantez içindeki detayı ayır
    const match = trimmed.match(/^([^(]+)(?:\(([^)]+)\))?$/);
    const baseName = match ? match[1].trim() : trimmed;
    const detail = match ? match[2] : null;
    
    // Türkçe karşılığı bul
    const translation = getWeaponProperty(baseName);
    
    return {
      name: translation?.name || baseName,
      desc: translation?.desc || '',
      detail: detail,
      original: trimmed
    };
  });
};