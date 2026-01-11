// src/components/moderation/AuditLogViewer.jsx

import React, { useState } from 'react';
import { Search, Calendar, User, Target, FileText, Loader2, Filter } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import moderationService from '../../services/moderationService';

const AuditLogViewer = () => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);

  // Fetch all audit logs
  const { data, isLoading } = useQuery({
    queryKey: ['mod-audit-logs', page],
    queryFn: () => moderationService.getAllAuditLogs(page, 50),
  });

  const auditLogs = data?.data?.content || [];
  const totalPages = data?.data?.totalPages || 1;

  // Filter logs by targetType
  const filteredLogs = auditLogs.filter(log => {
    if (filter !== 'all' && log.targetType !== filter) return false;
    if (searchTerm && !log.actorUsername.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    return true;
  });

  const targetTypes = ['all', 'HOMEBREW', 'BLOG', 'WIKI_COMMENT', 'BLOG_COMMENT', 'HOMEBREW_COMMENT', 'GUILD', 'CAMPAIGN', 'VENUE'];

  return (
    <div>
      {/* Filters */}
      <div className="space-y-4 mb-6">
        {/* Search */}
        <div className="relative">
          <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-sti" />
          <input
            type="text"
            placeholder="Moderatör kullanıcı adı ile ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-cbg rounded-xl focus:border-cta focus:ring-2 focus:ring-cta/20 outline-none font-medium text-mtf"
          />
        </div>

        {/* Type Filters */}
        <div className="flex gap-2 flex-wrap">
          {targetTypes.map(type => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`
                px-4 py-2 rounded-lg font-bold text-xs transition-colors
                ${filter === type
                  ? 'bg-cta text-white'
                  : 'bg-cbg text-sti hover:bg-cbg/70'
                }
              `}
            >
              {type === 'all' && '📋 Tümü'}
              {type === 'HOMEBREW' && '⚔️ Homebrew'}
              {type === 'BLOG' && '📝 Blog'}
              {type === 'GUILD' && '🛡️ Guild'}
              {type === 'CAMPAIGN' && '🎲 Campaign'}
              {type === 'VENUE' && '📍 Venue'}
              {type === 'WIKI_COMMENT' && '💬 Wiki'}
              {type === 'BLOG_COMMENT' && '💬 Blog'}
              {type === 'HOMEBREW_COMMENT' && '💬 Homebrew'}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 size={40} className="animate-spin text-cta" />
        </div>
      ) : filteredLogs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-sti font-bold">Bu filtre için audit log yok</p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {filteredLogs.map((log, idx) => (
              <AuditLogCard key={`${log.id}-${idx}`} log={log} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <button
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                className="px-4 py-2 bg-cbg text-mtf rounded-lg font-bold disabled:opacity-50"
              >
                ← Önceki
              </button>
              <span className="px-4 py-2 bg-white text-mtf font-bold">
                {page + 1} / {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="px-4 py-2 bg-cbg text-mtf rounded-lg font-bold disabled:opacity-50"
              >
                Sonraki →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

/**
 * Audit Log Card Component
 */
const AuditLogCard = ({ log }) => {
  const getActionColor = (action) => {
    if (action.includes('APPROVED')) return 'bg-green-100 text-green-700';
    if (action.includes('REJECTED') || action.includes('BANNED') || action.includes('DELETE')) return 'bg-red-100 text-red-700';
    if (action.includes('MOVED_TO_DRAFT')) return 'bg-amber-100 text-amber-700';
    if (action.includes('EDITED') || action.includes('UPDATED')) return 'bg-blue-100 text-blue-700';
    return 'bg-gray-100 text-gray-700';
  };

  const getActionIcon = (action) => {
    if (action.includes('APPROVED')) return '✅';
    if (action.includes('REJECTED')) return '❌';
    if (action.includes('BANNED')) return '🚫';
    if (action.includes('DELETE')) return '🗑️';
    if (action.includes('MOVED_TO_DRAFT')) return '📦';
    if (action.includes('EDITED') || action.includes('UPDATED')) return '✏️';
    if (action.includes('UNBANNED')) return '✅';
    return '📋';
  };

  return (
    <div className="bg-mbg rounded-xl p-4 border border-cbg hover:border-cta transition-all">
      <div className="flex items-start justify-between mb-3">
        {/* Action Info */}
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-lg text-xs font-bold ${getActionColor(log.action)}`}>
            {getActionIcon(log.action)} {log.action.replace(/_/g, ' ')}
          </span>
          <span className="text-xs text-sti font-bold">
            {log.targetType} #{log.targetId}
          </span>
        </div>

        {/* Timestamp */}
        <div className="flex items-center gap-2 text-xs text-sti">
          <Calendar size={12} />
          {new Date(log.createdAt).toLocaleString('tr-TR')}
        </div>
      </div>

      {/* Actor */}
      <div className="flex items-center gap-2 mb-2">
        <User size={14} className="text-sti" />
        <span className="text-sm font-bold text-mtf">
          {log.actorUsername}
        </span>
        {log.ipAddress && (
          <span className="text-xs text-sti">
            (IP: {log.ipAddress})
          </span>
        )}
      </div>

      {/* Details */}
      {log.details && (
        <div className="bg-white rounded-lg p-3 mt-2">
          <div className="flex items-start gap-2">
            <FileText size={14} className="text-sti flex-shrink-0 mt-0.5" />
            <p className="text-xs text-sti font-medium">
              {log.details}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditLogViewer;