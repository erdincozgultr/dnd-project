// src/redux/reducers/wikiReducer.js

import { WIKI_ACTIONS } from '../actions/wikiActions';
import { WIKI_PAGINATION, EXCLUDED_CATEGORIES } from '../../constants/wikiConstants.jsx';

const initialState = {
  // Liste
  entries: [],
  pagination: {
    page: WIKI_PAGINATION.DEFAULT_PAGE,
    size: WIKI_PAGINATION.DEFAULT_SIZE,
    totalPages: 0,
    totalElements: 0
  },
  
  // Filtreler
  activeCategory: null,
  searchQuery: '',
  sortBy: WIKI_PAGINATION.DEFAULT_SORT,
  sortDir: WIKI_PAGINATION.DEFAULT_SORT_DIR,
  contentType: 'official', // 'official' | 'homebrew'
  
  // Detay
  currentEntry: null,
  
  // İstatistik
  categoryCounts: {},
  
  // UI State
  loading: false,
  detailLoading: false,
  error: null,
  detailError: null
};

/**
 * SECTIONS ve DOCUMENTS kategorilerini filtrele
 */
const filterValidEntries = (entries) => {
  if (!entries || !Array.isArray(entries)) return [];
  return entries.filter(entry => !EXCLUDED_CATEGORIES.includes(entry.category));
};

const wikiReducer = (state = initialState, action) => {
  switch (action.type) {
    // ========== FETCH LIST ==========
    case WIKI_ACTIONS.FETCH_START:
      return {
        ...state,
        loading: true,
        error: null
      };
      
    case WIKI_ACTIONS.FETCH_SUCCESS:
      return {
        ...state,
        loading: false,
        entries: filterValidEntries(action.payload.entries), // Filtreleme burada!
        pagination: action.payload.pagination,
        error: null
      };
      
    case WIKI_ACTIONS.FETCH_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
        entries: []
      };
    
    // ========== FETCH DETAIL ==========
    case WIKI_ACTIONS.FETCH_DETAIL_START:
      return {
        ...state,
        detailLoading: true,
        detailError: null
      };
      
    case WIKI_ACTIONS.FETCH_DETAIL_SUCCESS:
      // SECTIONS ve DOCUMENTS detay sayfası açılırsa hata göster
      if (EXCLUDED_CATEGORIES.includes(action.payload?.category)) {
        return {
          ...state,
          detailLoading: false,
          detailError: 'Bu içerik kategorisi gösterilemiyor',
          currentEntry: null
        };
      }
      
      return {
        ...state,
        detailLoading: false,
        currentEntry: action.payload,
        detailError: null
      };
      
    case WIKI_ACTIONS.FETCH_DETAIL_ERROR:
      return {
        ...state,
        detailLoading: false,
        detailError: action.payload,
        currentEntry: null
      };
      
    case WIKI_ACTIONS.CLEAR_DETAIL:
      return {
        ...state,
        currentEntry: null,
        detailError: null
      };
    
    // ========== FILTERS ==========
    case WIKI_ACTIONS.SET_CATEGORY:
      return {
        ...state,
        activeCategory: action.payload
      };
      
    case WIKI_ACTIONS.SET_SEARCH:
      return {
        ...state,
        searchQuery: action.payload
      };
      
    case WIKI_ACTIONS.SET_PAGE:
      return {
        ...state,
        pagination: {
          ...state.pagination,
          page: action.payload
        }
      };
      
    case WIKI_ACTIONS.SET_SORT:
      return {
        ...state,
        sortBy: action.payload.sortBy,
        sortDir: action.payload.sortDir
      };
      
    case WIKI_ACTIONS.SET_CONTENT_TYPE:
      return {
        ...state,
        contentType: action.payload,
        // Content type değişince filtreleri sıfırla
        activeCategory: null,
        searchQuery: '',
        pagination: {
          ...state.pagination,
          page: 0
        }
      };
      
    case WIKI_ACTIONS.RESET_FILTERS:
      return {
        ...state,
        activeCategory: null,
        searchQuery: '',
        sortBy: WIKI_PAGINATION.DEFAULT_SORT,
        sortDir: WIKI_PAGINATION.DEFAULT_SORT_DIR,
        pagination: {
          ...state.pagination,
          page: 0
        }
      };
    
    // ========== STATS ==========
    case WIKI_ACTIONS.FETCH_STATS_SUCCESS:
      // Kategori sayılarından da SECTIONS ve DOCUMENTS'ı çıkar
      const filteredCounts = {};
      Object.entries(action.payload).forEach(([category, count]) => {
        if (!EXCLUDED_CATEGORIES.includes(category)) {
          filteredCounts[category] = count;
        }
      });
      
      return {
        ...state,
        categoryCounts: filteredCounts
      };
      
    default:
      return state;
  }
};

export default wikiReducer;