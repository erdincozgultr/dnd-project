// src/components/homebrew/create/HomebrewDisclaimer.jsx

import React, { useState } from 'react';
import { AlertTriangle, BookOpen, Scale, Eye, CheckCircle } from 'lucide-react';

const HomebrewDisclaimer = ({ onAccept, accepted = false }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const rules = [
    {
      icon: BookOpen,
      title: "Telif Hakkı",
      text: "Resmi D&D içeriğini birebir kopyalamayın. Kendi yorumunuzu katın ve orijinal içerik oluşturun.",
      color: "text-red-500"
    },
    {
      icon: Scale,
      title: "Oyun Dengesi",
      text: "Oluşturduğunuz içerik oyun dengesini bozabilir. DM onayı alınması önerilir.",
      color: "text-amber-500"
    },
    {
      icon: Eye,
      title: "Moderasyon",
      text: "Tüm homebrew içerik moderatör onayından geçer. Uygunsuz içerikler reddedilir.",
      color: "text-blue-500"
    }
  ];

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200 rounded-2xl p-6">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 rounded-xl bg-purple-500 flex items-center justify-center flex-shrink-0">
          <AlertTriangle size={24} className="text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-black text-purple-900 mb-1">
            Homebrew İçerik Kuralları
          </h3>
          <p className="text-sm text-purple-700">
            Lütfen içerik oluşturmadan önce aşağıdaki kuralları okuyun
          </p>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        {rules.map((rule, index) => (
          <div key={index} className="flex items-start gap-3 bg-white rounded-xl p-3">
            <rule.icon size={20} className={`${rule.color} flex-shrink-0 mt-0.5`} />
            <div>
              <p className="text-sm font-bold text-mtf">{rule.title}</p>
              <p className="text-xs text-sti">{rule.text}</p>
            </div>
          </div>
        ))}
      </div>

      {isExpanded && (
        <div className="bg-white rounded-xl p-4 mb-4 space-y-3">
          <h4 className="text-sm font-bold text-mtf">Detaylı Kurallar:</h4>
          
          <div className="text-xs text-sti space-y-2">
            <p>
              <strong>✓ Yapılması Gerekenler:</strong>
              <br />• Orijinal fikirler ve konseptler geliştirin
              <br />• Dengeli ve oynanabilir içerik oluşturun
              <br />• Açık ve anlaşılır açıklamalar yazın
              <br />• Kaynakları belirtin (esinlendiğiniz materyaller)
            </p>
            
            <p>
              <strong>✗ Yapılmaması Gerekenler:</strong>
              <br />• Resmi kitaplardan direkt kopyalama
              <br />• Aşırı güçlü veya zayıf içerik
              <br />• Cinsel, şiddet içerikli veya uygunsuz materyaller
              <br />• Başka kullanıcıların içeriklerini çalmak
            </p>

            <p>
              <strong>⚠️ Moderasyon Süreci:</strong>
              <br />Oluşturduğunuz içerik yayınlanmadan önce moderatörler tarafından 
              incelenecektir. Bu süreç 1-3 iş günü sürebilir. Uygun görülmeyen içerikler 
              reddedilir ve size bildirim gönderilir.
            </p>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-sm text-purple-600 hover:text-purple-700 font-bold mb-4"
      >
        {isExpanded ? '▲ Detayları Gizle' : '▼ Detaylı Kuralları Oku'}
      </button>

      <label className="flex items-start gap-3 cursor-pointer group">
        <div className="relative flex-shrink-0 mt-1">
          <input
            type="checkbox"
            checked={accepted}
            onChange={(e) => onAccept(e.target.checked)}
            className="sr-only peer"
            required
          />
          <div className="w-6 h-6 border-2 border-purple-300 rounded-lg 
                          peer-checked:bg-purple-500 peer-checked:border-purple-500
                          transition-all flex items-center justify-center">
            {accepted && <CheckCircle size={16} className="text-white" />}
          </div>
        </div>
        <span className="text-sm text-mtf group-hover:text-purple-700 transition-colors">
          Yukarıdaki kuralları okudum ve kabul ediyorum. Oluşturduğum içeriğin 
          moderasyon sürecinden geçeceğini anlıyorum. *
        </span>
      </label>
    </div>
  );
};

export default HomebrewDisclaimer;