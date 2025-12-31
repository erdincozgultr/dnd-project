// src/redux/actions/wikiActions.js

import axiosClient from '../../api/axiosClient';
import { WIKI_API, WIKI_PAGINATION } from '../../constants/wikiConstants';

// Action Types
export const WIKI_ACTIONS = {
  // Liste
  FETCH_START: 'wiki/FETCH_START',
  FETCH_SUCCESS: 'wiki/FETCH_SUCCESS',
  FETCH_ERROR: 'wiki/FETCH_ERROR',
  
  // Detay
  FETCH_DETAIL_START: 'wiki/FETCH_DETAIL_START',
  FETCH_DETAIL_SUCCESS: 'wiki/FETCH_DETAIL_SUCCESS',
  FETCH_DETAIL_ERROR: 'wiki/FETCH_DETAIL_ERROR',
  CLEAR_DETAIL: 'wiki/CLEAR_DETAIL',
  
  // Filtreler
  SET_CATEGORY: 'wiki/SET_CATEGORY',
  SET_SEARCH: 'wiki/SET_SEARCH',
  SET_PAGE: 'wiki/SET_PAGE',
  SET_SORT: 'wiki/SET_SORT',
  SET_CONTENT_TYPE: 'wiki/SET_CONTENT_TYPE',
  RESET_FILTERS: 'wiki/RESET_FILTERS',
  
  // İstatistik
  FETCH_STATS_SUCCESS: 'wiki/FETCH_STATS_SUCCESS'
};

// ============================================
// THUNK ACTIONS
// ============================================

/**
 * Content type değiştir (official | homebrew)
 */
export const setContentType = (contentType) => (dispatch) => {
  dispatch({ type: WIKI_ACTIONS.SET_CONTENT_TYPE, payload: contentType });
  dispatch({ type: WIKI_ACTIONS.SET_PAGE, payload: 0 });
  dispatch(fetchWikiEntries());
};

/**
 * Wiki/Homebrew listesi getir (pagination + filtre destekli)
 */
export const fetchWikiEntries = () => async (dispatch, getState) => {
  const { wiki } = getState();
  const { activeCategory, searchQuery, pagination, sortBy, sortDir, contentType } = wiki;
  
  dispatch({ type: WIKI_ACTIONS.FETCH_START });
  
  try {
    let baseUrl;
    let url;
    const params = new URLSearchParams({
      page: pagination.page,
      size: pagination.size
    });

    // Sort parametreleri (sadece wiki için)
    if (contentType === 'official') {
      params.append('sortBy', sortBy);
      params.append('sortDir', sortDir);
    }
    
    // Base URL belirleme
    baseUrl = contentType === 'homebrew' ? '/homebrews' : '/wiki';
    
    // URL belirleme
    if (searchQuery) {
      // Arama modu
      if (activeCategory) {
        url = `${baseUrl}/category/${activeCategory}/search?q=${encodeURIComponent(searchQuery)}&${params}`;
      } else {
        url = `${baseUrl}/search?q=${encodeURIComponent(searchQuery)}&${params}`;
      }
    } else if (activeCategory) {
      // Kategori modu
      url = `${baseUrl}/category/${activeCategory}?${params}`;
    } else {
      // Tüm içerikler
      url = `${baseUrl}?${params}`;
    }
    
    const response = await axiosClient.get(url);
    
    // Response format kontrolü
    const data = response.data;
    const entries = data.content || data;
    const paginationData = data.pageable ? {
      page: data.number,
      size: data.size,
      totalPages: data.totalPages,
      totalElements: data.totalElements
    } : {
      page: 0,
      size: entries.length,
      totalPages: 1,
      totalElements: entries.length
    };
    
    dispatch({
      type: WIKI_ACTIONS.FETCH_SUCCESS,
      payload: {
        entries,
        pagination: paginationData
      }
    });
  } catch (error) {
    dispatch({
      type: WIKI_ACTIONS.FETCH_ERROR,
      payload: error.response?.data?.message || 'Veriler yüklenirken hata oluştu'
    });
  }
};

/**
 * Wiki/Homebrew detay getir (slug ile)
 */
export const fetchWikiDetail = (slug, isHomebrew = false) => async (dispatch) => {
  dispatch({ type: WIKI_ACTIONS.FETCH_DETAIL_START });
  
  try {
    const baseUrl = isHomebrew ? '/homebrews' : '/wiki';
    const response = await axiosClient.get(`${baseUrl}/slug/${slug}`);
    
    dispatch({
      type: WIKI_ACTIONS.FETCH_DETAIL_SUCCESS,
      payload: response.data
    });
  } catch (error) {
    dispatch({
      type: WIKI_ACTIONS.FETCH_DETAIL_ERROR,
      payload: error.response?.data?.message || 'İçerik bulunamadı'
    });
  }
};

/**
 * Kategori sayılarını getir
 */
export const fetchCategoryStats = () => async (dispatch, getState) => {
  const { wiki } = getState();
  const { contentType } = wiki;
  
  try {
    const baseUrl = contentType === 'homebrew' ? '/homebrews' : '/wiki';
    const response = await axiosClient.get(`${baseUrl}/stats/counts`);
    
    dispatch({
      type: WIKI_ACTIONS.FETCH_STATS_SUCCESS,
      payload: response.data
    });
  } catch (error) {
    console.error('Stats fetch error:', error);
    // Stats hatası kritik değil, sessizce devam et
  }
};

// ============================================
// SYNC ACTIONS
// ============================================

/**
 * Kategori değiştir ve yeniden fetch
 */
export const setCategory = (category) => (dispatch) => {
  dispatch({ type: WIKI_ACTIONS.SET_CATEGORY, payload: category });
  dispatch({ type: WIKI_ACTIONS.SET_PAGE, payload: 0 }); // Sayfa sıfırla
  dispatch(fetchWikiEntries());
};

/**
 * Arama yap
 */
export const setSearch = (query) => (dispatch) => {
  dispatch({ type: WIKI_ACTIONS.SET_SEARCH, payload: query });
  dispatch({ type: WIKI_ACTIONS.SET_PAGE, payload: 0 });
  dispatch(fetchWikiEntries());
};

/**
 * Sayfa değiştir
 */
export const setPage = (page) => (dispatch) => {
  dispatch({ type: WIKI_ACTIONS.SET_PAGE, payload: page });
  dispatch(fetchWikiEntries());
};

/**
 * Sıralama değiştir
 */
export const setSort = (sortBy, sortDir) => (dispatch) => {
  dispatch({ type: WIKI_ACTIONS.SET_SORT, payload: { sortBy, sortDir } });
  dispatch({ type: WIKI_ACTIONS.SET_PAGE, payload: 0 });
  dispatch(fetchWikiEntries());
};

/**
 * Filtreleri sıfırla
 */
export const resetFilters = () => (dispatch) => {
  dispatch({ type: WIKI_ACTIONS.RESET_FILTERS });
  dispatch(fetchWikiEntries());
};

/**
 * Detayı temizle (sayfa değişiminde)
 */
export const clearDetail = () => ({
  type: WIKI_ACTIONS.CLEAR_DETAIL
});